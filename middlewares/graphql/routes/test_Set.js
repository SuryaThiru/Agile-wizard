const admin = require('firebase-admin');
let serviceaccount = require('./skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
    databaseURL: "https://skindoc-10ef5.firebaseio.com"
});
// Initializing firestore
let db = admin.firestore();
let test = db.collection('users').doc("test@test.com");
let obj = {
    fname: "test",
    lname: "001",
    phone: "9001",
    reg: "16BCETEST",
    password: "tests",
    gender:"male"
};

// Initializing the Authentication using Firebase
// let ok = admin.auth().createUser({
//     email: "amrut546@gmail.com",
//     emailVerified: false,
//     phoneNumber: "+11234567890",
//     password: "secretPassword",
//     displayName: "Acrylic Doe",
//     disabled: false
// }).then((Record)=>{
//     console.log("Successfully created new user: ", Record);
// }).catch((err)=>{
//     console.log("Error creating new user: ",err);
// });

// test for checking whether the user already exists

// console.log(obj.fname);
// test.create(obj).then((ref)=>{
//     console.log("here");
//     console.log("document successfully added :",ref);
// }).catch((err)=>{
//     console.log("error buddy ",err );
//     console.log("error message ", err.code);
// });

return test.get().then((doc)=>{
   if(!doc.exists){
       console.log("No such doc");
   }
   else{
       console.log(doc.data());
       return doc.data();
   }
}).then((dat)=>{
   return dat;
});

// test for handling queries and checking if user exists made for more than one unique fields

// let test = db.collection('users').where("reg","==","16BCE0567").get().then((doc)=>{
//    console.log("document data: ", doc);
// }).catch((err)=>{
//     console.log(err);
// });
// console.log("working");
// db.collection("users").where("reg", "==", "567").where("email","==","amrut546@gmail.com").get()
//     .then(snapshot => {
//         if(snapshot.empty){
//             console.log("fuck yah");
//             // if db.collection("users").where("email", "==", "amrut546@gmail.com").where("reg", "==", "stuff")
//         }
//         else {
//             snapshot.forEach(doc => {
//                 console.log();
//                 if (doc.id === "") {
//                     console.log("space works")
//                 }
//                 if (doc === null) {
//                     console.log("null works;")
//                 }
//                 if (!doc.exists) {
//                     console.log("No such doc");
//                 }
//                 else {
//                     console.log("inside here");
//                     console.log(doc.id, '=>', doc.data());
//                 }
//             });
//         }
//     })
//     .catch(err => {
//         console.log('Error getting documents', err);
//     });
// let i = 10;

// let one = function Set() {
//     let kappa = Math.random();
//     test.set({QRCODE:kappa});
//     console.log(kappa);
// };
// setInterval(one, 15000);


// let docRef = db.collection('users').get().then((snapshot)=>{
//     snapshot.forEach((doc)=>{
//        console.log(doc.id,'=>',doc.data());
//     });
// }).catch((err)=>{
//    console.log("Error",err);
// });

