var express = require("express");
var router = express.Router();
var zwss = require("../lib/zwss.js");
var fs = require("fs");
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
  var page = req.params.page;
  var zwssFile = fs.readFileSync("./public/hosted/" + page + ".zwss", "utf8");
  var html = zwss.render(zwssFile);
  res.send(html);
});

module.exports = router;
