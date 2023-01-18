var express = require("express");
var app = express();
var express = require("express");
var passport = require("passport");
var util = require("util");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var GitHubStrategy = require("passport-github2").Strategy;
var partials = require("express-partials");
var path = require("path");
var sites = [];
var GITHUB_CLIENT_ID = "c42cb6b28105c1423102";
var GITHUB_CLIENT_SECRET = "3041032d8ebdaf15963a40856416dddc8d4179ea";

// MIDDLEWARES
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(methodOverride());
app.use(
  session({
    secret:
      "nbgvfxdcgddfgfhgfhgjfdgjhkbkjlklmljknljhgvjgb876xdfs7t&T&BRB%&rbxZ&R7t8t",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(partials());
// user serials
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        // insert epic json db here
        return done(null, profile);
      });
    }
  )
);

app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

app.get("/site/:id", function (req, res) {
  res.send("not yet");
});
app.post("/api/new/site", function (req, res) {
  res.status(201).json({ msg: "not implemented" });
});
app.post("/api/update/site", function (req, res) {
  // var siteIndex = sites.findIndex((obj => obj.id == req.body.id));
  // sites[siteIndex].content = req.body.content
  res.status(201).json({ msg: `not implemented` });
});

app.get("/account", ensureAuthenticated, function (req, res) {
  res.render("account", { user: req.user });
});

app.get("/login", function (req, res) {
  res.render("login", { user: req.user });
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  function (req, res) {}
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000);
console.log("znci-web listening on 3000");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
