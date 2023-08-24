// Desc: API router for the app
import * as express from "express";
import createError from "http-errors";
import * as admin from "firebase-admin";
import { db } from "../lib/firebase.js";
import { zwss } from "../lib/zwss.js";
import { checker } from "../lib/auth.js";
import { FieldValue } from "@google-cloud/firestore";
import { User, Site, SiteArray } from "../types/types.js";
import { Buffer } from "buffer";
import * as yaml from "js-yaml";

const router: express.Router = express.Router();

router.use(checker);

/* New ZWSS file. */
router.get("/new", function (req, res, next) {
  const { contents, id } = zwss.generate();
  const headers = req.headers;
  // add site to db
  db.collection("sites")
    .doc(id)
    .set({
      id: id,
      owner: headers["x-user"],
      managers: [],
      b64_zwss: btoa(contents),
    });

  // add site to user's sites
  db.collection("users")
    .doc(headers["x-user"] as string)
    .update({
      sites: FieldValue.arrayUnion(id),
    });

  res.status(200).send({ msg: "ok", id });
});

/* Get ZWSS file. */
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  if (id.includes("..")) {
    return Promise.reject(createError(400, "bad request (invalid id)")).catch(
      (err) => next(err),
    );
  }
  db.collection("sites")
    .where("id", "==", id)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return Promise.reject(createError(404, "not found")).catch((err) =>
          next(err),
        );
      }
      snapshot.forEach(async (doc) => {
        const b64_zwss = doc.data().b64_zwss;
        const zwssFile = await atob(b64_zwss);
        const zwss_json = yaml.load(zwssFile);
        res.status(200).send(zwss_json);
      });
    })
    .catch((err) => {
      next(err);
    });
});

/* Update ZWSS file. (add/remove blocks) */
router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const { type, index } = req.query;

  if (id.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }

  if (!type) {
    return next(createError(400, "bad request (missing type)"));
  }

  try {
    const snapshot = await db.collection("sites").where("id", "==", id).get();

    if (snapshot.empty) {
      return next(createError(404, "not found"));
    }

    snapshot.forEach(async (doc) => {
      const b64_zwss = doc.data().b64_zwss;
      var zwssFile = atob(b64_zwss);

      switch (type) {
        case "add":
          var bc = req.body;
          console.log(typeof bc);
          Object.keys(bc).forEach((key) => {
            if (bc[key] === "") {
              delete bc[key];
            }
          });
          console.log(bc);
          zwss.addBlock(zwssFile, bc as object).then((newZWSS) => {
            db.collection("sites")
              .doc(id)
              .update({
                b64_zwss: btoa(newZWSS),
              })
              .then(() => {
                res.status(200).send({ msg: "ok" });
              });
          });

          break;
        case "remove":
          if (!index) {
            return next(createError(400, "bad request (missing index)"));
          }

          zwss
            .removeBlock(zwssFile, index as unknown as number)
            .then((newZWSS) => {
              db.collection("sites")
                .doc(id)
                .update({
                  b64_zwss: btoa(newZWSS),
                })
                .then(() => {
                  res.status(200).send({ msg: "ok" });
                });
            });
          break;
        default:
          res.status(400).send({
            msg: "bad request (invalid type)",
            meta: "https://http.cat/400",
          });
      }
    });
  } catch (err) {
    return next(createError(500, "internal server error"));
  }
});

export default router;
