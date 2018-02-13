const admin = require('firebase-admin');
const serviceaccount = require('../config/lazarus-c11d5-firebase-adminsdk-r6g6o-0977b50984');

admin.initializeApp ({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://lazarus-c11d5.firebaseio.com"
});

let db = admin.firestore();

module.exports = db;
