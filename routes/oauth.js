const express = require("express");
const router = express.Router();
const XMLHttpRequest = require("xmlhttprequest-ssl").XMLHttpRequest;
const session = require("express-session");
const db = require("../lib/firebase.js");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

router.use(
  session({
    secret: process.env.SESSION_SECRET
  })
);

router.get("/login", function (req, res, next) {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      process.env.CLIENT_ID
    }&redirect_uri=${encodeURI(
      process.env.REDIRECT_URI
    )}&response_type=code&scope=identify`
  );
});

var auth_settings = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  grant_type: "authorization_code"
};

router.get("/callback", function (req, res, next) {
  var code = req.query.code;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://discord.com/api/oauth2/token");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = JSON.parse(xhr.responseText);
      var access_token = json.access_token;
      var xhr2 = new XMLHttpRequest();
      xhr2.open("GET", "https://discord.com/api/users/@me");
      xhr2.onload = function () {
        if (xhr2.status == 200) {
          var json2 = JSON.parse(xhr2.responseText);
          req.session.user = json2;
          db.collection("users")
            .where("id", "==", json2.id)
            .get()
            .then((snapshot) => {
              if (snapshot.empty) {
                db.collection("users").doc(json2.id).set({
                  id: json2.id,
                  username: json2.username,
                  sites: [],
                  managedSites: [],
                  apiKey: uuidv4()
                });
              }
            });
          res.redirect("/");
        }
      };
      xhr2.setRequestHeader("Authorization", "Bearer " + access_token);
      xhr2.send();
    } else {
      res.send(xhr.responseText);
    }
  };
  xhr.send(
    "client_id=" +
      auth_settings.client_id +
      "&client_secret=" +
      auth_settings.client_secret +
      "&grant_type=" +
      auth_settings.grant_type +
      "&code=" +
      code +
      "&redirect_uri=" +
      auth_settings.redirect_uri +
      "&scope=identify"
  );
});

module.exports = router;
