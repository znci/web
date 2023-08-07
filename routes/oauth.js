var express = require("express");
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest-ssl").XMLHttpRequest;
var session = require("express-session");

router.use(
  session({
    secret: "mFFBfPaJJtlgH1Nla6hT3jRGyAaR0NMh"
  })
);

router.get("/login", function (req, res, next) {
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=1137864637380034660&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Foauth%2Fcallback&response_type=code&scope=identify"
  );
});

var auth_settings = {
  client_id: "1137864637380034660",
  client_secret: "mFFBfPaJJtlgH1Nla6hT3jRGyAaR0NMh", // STAGING creds
  redirect_uri: "http://127.0.0.1:3000/oauth/callback",
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
          console.log(req.session.user);
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
