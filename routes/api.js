const express = require("express");
const router = express.Router();
const zwss = require("../lib/zwss.js");
const createError = require("http-errors");
const db = require("../lib/firebase.js");

function checkKeyValid(user_id, key, site_id = null) {
  if (site_id === null) {
    // This means we're checking the user's key - not against a specific site - so we can just check the user's key
    db.collection("users")
      .where("id", "==", user_id)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return false;
        }
        snapshot.forEach((doc) => {
          if (doc.data().apiKey == key) {
            return true;
          } else {
            return false;
          }
        });
      })
      .catch((err) => {
        return false;
      });
  } else {
    // This means we're checking the user's key against a specific site
    db.collection("sites")
      .where("id", "==", site_id)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return false;
        }
        snapshot.forEach((doc) => {
          if (doc.data().owner == user_id) {
            // Make sure the key is the user's key
            db.collection("users")
              .where("id", "==", user_id)
              .get()
              .then((snapshot) => {
                if (snapshot.empty) {
                  return false;
                }
                snapshot.forEach((doc) => {
                  if (doc.data().apiKey == key) {
                    return true;
                  } else {
                    return false;
                  }
                });
              });
          } else {
            return false;
          }
        });
      })
      .catch((err) => {
        return false;
      });
  }
}

function checker(req, res, next) {
  var headers = req.headers;
  if (!headers["x-api-key"]) {
    return next(createError(401, "unauthorized"));
  }
  const key = headers["x-api-key"];
  const user_id = headers["x-user"];
  switch (req.method) {
    case "GET":
      if (!checkKeyValid(user_id, key)) {
        return next(createError(401, "unauthorized"));
      }
      break;
    default:
      if (!checkKeyValid(user_id, key, req.params)) {
        return next(createError(401, "unauthorized"));
      }
      break;
  }
  next();
}

router.use(checker);

/* New ZWSS file. */
router.get("/new", function (req, res, next) {
  const { contents, id } = zwss.generate();
  // add site to db
  db.collection("sites")
    .doc(id)
    .set({
      id: id,
      owner: req.session.user.id,
      managers: [],
      b64_zwss: Buffer.from(contents).toString("base64")
    });

  // add site to user's sites
  db.collection("users")
    .doc(req.session.user.id)
    .update({
      sites: admin.firestore.FieldValue.arrayUnion(id)
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
        const zwssFile = Buffer.from(b64_zwss, "base64").toString("utf-8");
        res.send(zwssFile);
      });
    });
});

/* Update ZWSS file. (add/remove blocks) */
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const { type, index } = req.query;
  const { block } = req.body;

  if (id.includes("..")) {
    return next(createError(400, "bad request (invalid id)"));
  }

  if (!type) {
    return next(createError(400, "bad request (missing type)"));
  }

  try {
    var zwss_b64 = db
      .collection("sites")
      .where("id", "==", id)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return next(createError(404, "not found"));
        }
        snapshot.forEach((doc) => {
          const b64_zwss = doc.data().b64_zwss;
          const zwssFile = Buffer.from(b64_zwss, "base64").toString("utf-8");
          return zwssFile;
        });
      });
    var zwssFile = Buffer.from(zwss_b64, "base64").toString("utf-8");

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
          meta: "https://http.cat/400"
        });
    }

    db.collection("sites")
      .doc(id)
      .update({
        b64_zwss: Buffer.from(zwssFile).toString("base64")
      });

    res.status(200).send({ msg: "ok" });
  } catch (err) {
    next(createError(400, "bad request"));
  }
});

module.exports = router;
