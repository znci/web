// Desc: API router for the app
import * as express from "express";
import createError from "http-errors";
import * as admin from "firebase-admin";
import { db } from "../lib/firebase.js";
import { zwss } from "../lib/zwss.js";
import { checker } from "../lib/auth.js";
import { FieldValue } from "@google-cloud/firestore";
import { User, Site, SiteArray } from "../types/types.js";

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
    return next(createError(400, "bad request (invalid id)"));
  }
  db.collection("sites")
    .where("id", "==", id)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return next(createError(404, "not found"));
      }
      snapshot.forEach((doc) => {
        const b64_zwss = doc.data().b64_zwss;
        const zwssFile = atob(b64_zwss as any); // TODO: Remove any
        res.send(zwssFile);
      });
    });
});

/* Update ZWSS file. (add/remove blocks) */
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const { type, index } = req.query;
  const { block } = req.body;
  console.log(req.body);

  if (id.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }

  if (!type) {
    return next(createError(400, "bad request (missing type)"));
  }

  try {
    db
      .collection("sites")
      .where("id", "==", id)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return next(createError(404, "not found"));
        }
        snapshot.forEach((doc) => {
          const b64_zwss = doc.data().b64_zwss;
          var zwssFile = atob(b64_zwss);
		  
          var zwssFile = atob(b64_zwss as any);
        console.log(zwssFile);

        switch (type) {
          case "add":

            zwssFile = zwss.addBlock(zwssFile, block);
            break;
          case "remove":
            if (!index) {
              return next(createError(400, "bad request (missing index)"));
            }

            zwssFile = zwss.removeBlock(zwssFile, index as unknown as number);
            break;
          default:
            res.status(400).send({
              msg: "bad request (invalid type)",
              meta: "https://http.cat/400",
            });
        }

        db.collection("sites")
          .doc(id)
          .update({
            b64_zwss: btoa(zwssFile),
          });

        res.status(200).send({ msg: "ok" });
        });
        
      });
  } catch (err) {
    return next(createError(500, "internal server error"));
  }
});

export default router;
