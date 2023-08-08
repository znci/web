import admin from "firebase-admin";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const serviceAccount = require(path.join(
  __dirname,
  "../serviceAccountKey.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

// create users collection if it doesn't exist
db.collection("users")
  .get()
  .then((snapshot) => {
    if (snapshot.empty) {
      db.collection("users").doc("default").set({
        id: "0",
        name: "Webmaster",
        username: "webmaster",
        sites: [],
        managedSites: [],
        apiKey: uuidv4(), // generate random api key, can be reset at will of user
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
        b64_zwss: "e30=",
      });
    }
  });

export { db };
