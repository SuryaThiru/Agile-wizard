const admin = require('firebase-admin');
const serviceaccount = require('../config/skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1');

admin.initializeApp ({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://skindoc-10ef5.firebaseio.com"
});

let db = admin.firestore();

module.exports = db;
