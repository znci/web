const admin = require("firebase-admin");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require(path.join(
  __dirname,
  "../serviceAccountKey.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// create users collection if it doesn't exist
db.collection("users")
  .get()
  .then((snapshot) => {
    if (snapshot.empty) {
      db.collection("users").doc("default").set({
        id: "0",
        username: "webmaster",
        sites: [],
        managedSites: [],
        apiKey: uuidv4() // generate random api key, can be reset at will of user
      });
    }
  });

// Create sites collection if it doesn't exist
db.collection("sites")
  .get()
  .then((snapshot) => {
    if (snapshot.empty) {
      db.collection("sites").doc("default").set({
        id: "0",
        owner: "0",
        managers: [],
        b64_zwss: "e30="
      });
    }
  });

module.exports = db;
