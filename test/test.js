const admin = require('firebase-admin');
const serviceaccount = require('../config/skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1');
admin.initializeApp ({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://skindoc-10ef5.firebaseio.com"
});

let db = admin.firestore();

db.collection('fests').where('ID','==',3)
  .get()
  .then(snapshot=>{
    console.log(snapshot);
    if(!snapshot.empty)
      snapshot.forEach(doc =>{
        console.log(doc.data());
        console.log(doc.id);
      });

    else
      console.log("Doesnt exist not working");
}).catch(err=>{
  console.log(err);
});