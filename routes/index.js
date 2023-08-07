var express = require("express");
var router = express.Router();
var zwss = require("../lib/zwss.js");
var fs = require("fs");
const createError = require("http-errors");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/:page", function (req, res, next) {
  const { page } = req.params;

  if (page.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }

  const zwssFile = fs.readFileSync("./public/hosted/" + page + ".zwss", "utf8");
  const html = zwss.render(zwssFile);

  res.send(html);
});

module.exports = router;
