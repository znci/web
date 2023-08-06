var express = require("express");
var router = express.Router();
var zwss = require("../lib/zwss.js");
var fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/:page", function (req, res, next) {
  const { page } = req.params;

  if (page.includes("..")) {
    res.status(400).send({
      msg: "bad request (invalid id)",
      meta: "https://http.cat/400",
    });
    return;
  }

  const zwssFile = fs.readFileSync("./public/hosted/" + page + ".zwss", "utf8");
  const html = zwss.render(zwssFile);

  res.send(html);
});

module.exports = router;
