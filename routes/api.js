const express = require("express");
const router = express.Router();
const fs = require("fs");
const zwss = require("../lib/zwss.js");
const path = require("path");
const yaml = require("yaml");

/* New ZWSS file. */
router.get("/new", function (req, res, next) {
  const site = zwss.generate();
  const ps = yaml.parse(site);

  fs.writeFileSync(path.join("./public/hosted/" + ps.id + ".zwss"), site);
  res.status(200).send({ msg: "ok", id: ps.id });
});

/* Get ZWSS file. */
router.get("/:id", function (req, res, next) {
  const { id } = req.params;

  if (id.includes("..")) {
    res.status(400).send({
      msg: "bad request (invalid id)",
      meta: "https://http.cat/400",
    });
    return;
  }

  try {
    const zwssFile = fs.readFileSync(
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
  const { id } = req.params;
  const { type, block, index } = req.query;

  if (id.includes("..")) {
    res.status(400).send({
      msg: "bad request (invalid id)",
      meta: "https://http.cat/400",
    });
    return;
  }

  if (!type) {
    res.status(400).send({
      msg: "bad request (missing type)",
      meta: "https://http.cat/400",
    });
  }

  try {
    let zwssFile = fs.readFileSync(
      path.join("./public/hosted/" + id + ".zwss"),
      "utf8"
    );

    switch (type) {
      case "add":
        if (!block) {
          res.status(400).send({
            msg: "bad request (missing block)",
            meta: "https://http.cat/400",
          });
          return;
        }

        zwssFile = zwss.addBlock(zwssFile, block);
        break;
      case "remove":
        if (!index) {
          res.status(400).send({
            msg: "bad request (missing index)",
            meta: "https://http.cat/400",
          });
          return;
        }

        zwssFile = zwss.removeBlock(zwssFile, index);
        break;
      default:
        res.status(400).send({
          msg: "bad request (invalid type)",
          meta: "https://http.cat/400",
        });
    }

    fs.writeFileSync(path.join("./public/hosted/" + id + ".zwss"), zwssFile);
    res.status(200).send({ msg: "ok" });
  } catch (err) {
    res.status(400).send({ msg: "bad request", meta: "https://http.cat/400" });
  }
});

module.exports = router;
