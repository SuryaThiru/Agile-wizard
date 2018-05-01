import admin from "firebase-admin";
import serviceaccount
  from "../config/lazarus-c11d5-firebase-adminsdk-r6g6o-0977b50984.json";

admin.initializeApp ({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://lazarus-c11d5.firebaseio.com"
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