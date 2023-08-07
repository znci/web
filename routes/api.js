const express = require("express");
const router = express.Router();
const fs = require("fs");
const zwss = require("../lib/zwss.js");
const path = require("path");
const yaml = require("yaml");
const createError = require("http-errors");

/* New ZWSS file. */
router.get("/new", function (req, res, next) {
  const { contents, id } = zwss.generate();

  fs.writeFileSync(path.join("./public/hosted/" + id + ".zwss"), contents);
  res.status(200).send({ msg: "ok", id });
});

/* Get ZWSS file. */
router.get("/:id", function (req, res, next) {
  const { id } = req.params;

  if (id.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }

  try {
    const zwssFile = fs.readFileSync(
      path.join("./public/hosted/" + id + ".zwss"),
      "utf8"
    );

    res.send(zwssFile);
  } catch (err) {
    next(createError(404, "not found"));
  }
});

/* Update ZWSS file. (add/remove blocks) */
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const { type, block, index } = req.query;

  if (id.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }

  if (!type) {
    return next(createError(400, "bad request (missing type)"));
  }

  try {
    let zwssFile = fs.readFileSync(
      path.join("./public/hosted/" + id + ".zwss"),
      "utf8"
    );

    switch (type) {
      case "add":
        if (!block) {
          return next(createError(400, "bad request (missing block)"));
        }

        zwssFile = zwss.addBlock(zwssFile, block);
        break;
      case "remove":
        if (!index) {
          return next(createError(400, "bad request (missing index)"));
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
    next(createError(400, "bad request"));
  }
});

module.exports = router;
