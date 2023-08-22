// Desc: Main router for the app
import * as express from "express";
import createError from "http-errors";
import { zwss } from "../lib/zwss.js";
import { db } from "../lib/firebase.js";
import { SiteArray } from "../types/types.js";

const router: express.Router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let no_of_sites = 0;
  db.collection("sites")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        no_of_sites++;
      });
      res.render("index", { no_of_sites: no_of_sites, us: req.session.user });
    });
});

router.get("/dashboard", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/oauth/login");
  }
  db.collection("users")
    .where("id", "==", req.session.user.id)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.render("dashboard", { sites: [], us: req.session.user });
      }
      snapshot.forEach((doc) => {
        let sites = doc.data().sites;
        console.log(sites);
        res.render("dashboard", { sites: sites, us: req.session.user });
      });
    });
});

router.get("/dashboard/manage/:id", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/oauth/login");
  }
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
        res.render("manage", { site: doc.data(), us: req.session.user });
      });
    });
});

router.get("/dashboard/manage/:id/add", function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/oauth/login");
  }
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
        res.render("add", { site: doc.data(), us: req.session.user });
      });
    });
});

router.get("/:page", function (req, res, next) {
  const { page } = req.params;

  if (page.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }
  db.collection("sites")
    .where("id", "==", page)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return next(createError(404, "not found"));
      }
      snapshot.forEach((doc) => {
        const b64_zwss = doc.data().b64_zwss;
        const zwssFile = Buffer.from(b64_zwss, "base64").toString("utf-8");
        const html = zwss.render(zwssFile);
        res.send(html);
      });
    })
    .catch((err) => {
      return next(createError(500, "internal server error"));
    });
});

export default router;
