const QRcode = require('qrcode');
const crypto = require('crypto');
const db = require('../db');

function getQR(value) {
  // returns a promise that resolves to a data url

  return QRcode.toDataURL(value);
}

function qrLoop(festID, timelimit, updateInterval) {  
  let ct = new CountDownTimer(timelimit);
  let doc = db.collection('fests').doc(festID);

  // TODO error handling and linking with resolvers
}

function updateqrURL(doc) {
  let id = crypto.randomBytes(16).toString('hex');

  getQR(id)
    .then(url => {
      if(!err) {
        // update DB
        doc.update({QRcode: url})
          .then(console.log)
          .catch(err => return err)
      }
    })
    .catch(err => return err)
}

function CountDownTimer(minutes) {
  // object to countdown minutes
  this.startTime = new Date(); // start on construction
  this.countFrom = minutes;

  this.isTimeUp = function () {
    let currentTime = new Date();
    let diff = (currentTime - this.startTime) / (1000 * 60);
    console.log(diff);
    return diff > this.countFrom;
  }
}

module.exports = qrLoop;
