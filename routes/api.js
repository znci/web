var express = require("express");
var router = express.Router();
var fs = require("fs");
var zwss = require("../lib/zwss.js");
var path = require("path");
var yaml = require("yaml");

/* New ZWSS file. */
router.get("/new", function (req, res, next) {
  var site = zwss.generate();
  var ps = yaml.parse(site);
  console.log(site);
  fs.writeFileSync(path.join("./public/hosted/" + ps.id + ".zwss"), site);
  res.status(200).send({ msg: "ok", id: ps.id });
});

/* GET ZWSS file. */
router.get("/:id", function (req, res, next) {
  var id = req.params.id;
  // try to read and catch errors
  try {
    var zwssFile = fs.readFileSync(
      path.join("./public/hosted/" + id + ".zwss"),
      "utf8"
    );
    res.send(zwssFile);
  } catch (err) {
    res.status(404).send({ msg: "not found", meta: "https://http.cat/404" });
  }
});

/* Update ZWSS file. (add/remove blocks) */
router.put("/:id", function (req, res, next) {
  var id = req.params.id;
  try {
    var zwssFile = fs.readFileSync(
      path.join("./public/hosted/" + id + ".zwss"),
      "utf8"
    );
  } catch (err) {
    res.status(404).send({ msg: "not found", meta: "https://http.cat/404" });
  }
  var a = req.query;
  if (a.type == "add") {
    try {
      zwssFile = zwss.addBlock(zwssFile, a.block);
    } catch (err) {
      res
        .status(400)
        .send({ msg: "bad request", meta: "https://http.cat/400" });
    }
  } else if (a.type == "remove") {
    try {
      zwssFile = zwss.removeBlock(zwssFile, a.index);
    } catch (err) {
      res
        .status(400)
        .send({ msg: "bad request", meta: "https://http.cat/400" });
    }
  }
  fs.writeFileSync(path.join("./public/hosted/" + id + ".zwss"), zwssFile);
  res.status(200).send({ msg: "ok" });
});

module.exports = router;
