const admin = require('firebase-admin');
const serviceaccount = require('../config/skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1');
admin.initializeApp ({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://skindoc-10ef5.firebaseio.com"
});

let db = admin.firestore();

db.collection('fests').doc("9t6NFkN33v4jYd3cil3V")
  .update({QRCODE: "test"})
  .then(()=>{
    // console.log(snapshot);
    // if(!snapshot.empty)
    //   snapshot.forEach(doc =>{
    //     console.log(doc.data());
    //     console.log(doc.id);
    console.log("success");
}).catch(err=>{
  console.log(err);
});