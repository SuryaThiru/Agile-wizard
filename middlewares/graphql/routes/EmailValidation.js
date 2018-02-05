const express = require('express');
let router = express.Router();
const admin = require('firebase-admin');
let serviceaccount = require('./skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
    databaseURL: "https://skindoc-10ef5.firebaseio.com"
});

function handleVerifyEmail(actionCode,resp) {
    // Try to apply the email verification code.
    admin.auth.applyActionCode(actionCode).then(function (resp) {
        // Email address has been verified.
        resp.render("verification", {error: null});
        // TODO: Display a confirmation message to the user.
        // You could also provide the user with a link back to the app.

        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
    }).catch(function (err) {
        resp.render("verification", {error: err});

    });
}
router.get('/action', (req, res, next)=> {
    let mode = req.query.mode;
    let actionCode = req.query['oobCode'];
    handleVerifyEmail(actionCode, res);
});
