const QRcode = require('qrcode');
const crypto = require('crypto');
const db = require('../db');

function getQR(value) {
  // returns a promise that resolves to a data url
  return QRcode.toDataURL(value);
}

function qrLoop(festID, timelimit, updateInterval) {
  let doc = db.collection('fests').doc(festID);
  let ct = new CountDownTimer(timelimit);

  let timer = setInterval(() => {
    if (!ct.isTimeUp()) {
      updateqrURL(doc, timer);  // I HATE YOU JS!!!
      console.log('starting qr loop');
    }
    else {
      clearInterval(timer);
      clearqrURL(doc);

      console.log('ending qr loop');
    }
  }, updateInterval * 1000);
}

function updateqrURL(doc, timer) {
  let id = crypto.randomBytes(16).toString('hex');

  return getQR(id)
    .then(url => {
      // update DB
      doc.update({QRcode: url})
        .then(doc=>{
          console.log(doc);
        })
        .catch(err => {
          clearInterval(timer);
          clearqrURL(doc);
          
          console.log('ending qr loop');
          console.log(err);
        });
    })
    .catch(err => {
      clearInterval(timer);
      clearqrURL(doc);

      console.log('ending qr loop');
      console.log(err);
    })
}

function clearqrURL(doc) {
  console.log('nulling qr field');

  doc.update({QRcode: null})
    .then(console.log)
    .catch(console.log);
}

function CountDownTimer(minutes) {
  // object to countdown minutes
  this.startTime = new Date(); // start on construction
  this.countFrom = minutes;

  this.isTimeUp = function () {
    let currentTime = new Date();
    let diff = (currentTime - this.startTime) / (1000 * 60);
    return diff > this.countFrom;
  }
}

module.exports = qrLoop;
