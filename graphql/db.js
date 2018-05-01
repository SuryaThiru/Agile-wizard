import admin from "firebase-admin";
import serviceaccount
  from "../config/lazarus-c11d5-firebase-adminsdk-r6g6o-0977b50984";

admin.initializeApp ({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://lazarus-c11d5.firebaseio.com"
});

let db = admin.firestore();

export default db;
