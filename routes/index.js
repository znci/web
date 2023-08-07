var express = require("express");
var router = express.Router();
var zwss = require("../lib/zwss.js");
const createError = require("http-errors");
const db = require("../lib/firebase.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.session) {
    req.session = {};
  }

  res.render("index", {
    title: "Express",
    session: JSON.stringify(req.session)
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

module.exports = router;
