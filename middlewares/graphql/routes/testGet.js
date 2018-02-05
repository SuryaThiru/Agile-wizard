const admin = require('firebase-admin');
let serviceaccount = require('./skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
    databaseURL: "https://skindoc-10ef5.firebaseio.com"
});

let db = admin.firestore();
let doc = db.collection('qrcode').doc('qrchannel');
let observer = doc.onSnapshot(docSnapshot => {
    console.log('Recieved doc snapshot: ', docSnapshot.data());
}, err=>{
    console.log('Encountered error:', err);
});