// Desc: OAuth router for the app
import * as express from "express";
import { db } from "../lib/firebase.js";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import * as path from "path";
import { configDotenv } from "dotenv";
configDotenv({
  path: path.join(__dirname, "../.env"),
});
const router: express.Router = express.Router();

router.get("/login", function (req, res, next) {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=1137864637380034660&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Foauth%2Fcallback&response_type=code&scope=identify`
  );
});

var auth_settings = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  grant_type: "authorization_code",
};

router.get("/callback", async function (req, res, next) {
  const code = req.query.code;
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `client_id=${auth_settings.client_id}&client_secret=${auth_settings.client_secret}&grant_type=${auth_settings.grant_type}&code=${code}&redirect_uri=${auth_settings.redirect_uri}&scope=identify`,
  });
  if (response.status === 200) {
    const json: any = await response.json();
    const access_token: String = json.access_token;
    const response2 = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response2.status === 200) {
      const json2: any = await response2.json();
      const api_key = uuidv4();
      // Create a session
      req.session.user! = json2;
      // set api key in session
      req.session.user!.apiKey = api_key;
      req.session.save();

      const snapshot = await db
        .collection("users")
        .where("id", "==", json2.id)
        .get();
      if (snapshot.empty) {
        await db.collection("users").doc(json2.id).set({
          id: json2.id,
          username: json2.username,
          sites: [],
          managedSites: [],
          apiKey: api_key,
        });
      }
      res.redirect("/");
    }
  } else {
    res.send(await response.text());
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    }
  });
  res.redirect("/");
});

export default router;
