const QRcode = require('qrcode');
const crypto = require('crypto');
const db = require('../db');

const updateInterval = 10; // udpate every few sec
let festsBuffer = {};

function updateqrURL(doc, timer, festID) {
  let id = crypto.randomBytes(8).toString('hex');
  let data = {
    festID: festID,
    id: id
  };

  return getQR(JSON.stringify(data))
    .then(url => {
      // update DB
      doc.update({QRuri: url, QRval: id})
        .then(doc => {
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
    });
}

function clearqrURL(doc) {
  console.log('nulling qr field');

  doc.update({QRuri: null, QRval: null})
    .then(console.log)
    .catch(console.log);
}

function getQR(value) {
  // returns a promise that resolves to a data url
  return QRcode.toDataURL(value);
}

function enableQR(festId) {
  let doc = db.collection('fests').doc(festId);

  if (festsBuffer[festId])
    return {
      status: 'qr loop already running'
    };

  return doc.get()
    .then(dat => {
        if (!dat.exists) {
          return {
            status: 'fest is not currently active'
          };
        }

        if (!festsBuffer[festId]) {
          let timer = setInterval(() => {
            updateqrURL(doc, timer, festId);
          }, updateInterval * 1000);

          festsBuffer[festId] = timer;

          console.log('starting qr loop');
          console.log(Object.keys(festsBuffer));

          return {
            status: 'qr loop initiated'
          };
        }
      })
    .catch(err => {
      console.log(err);
      return {
        status: err.message
      };
    });
}

function disableQR(festId) {
  let doc = db.collection('fests').doc(festId);

  if (!festsBuffer[festId])
    return {
      code: 1,
      status: 'qr loop not running to stop'
    };

  clearInterval(festsBuffer[festId]);
  clearqrURL(doc);
  delete festsBuffer[festId];

  console.log('stopped qr loop for ' + festId);

  return {
    code: 0,
    status: 'stopped qr loop'
  };
}


module.exports = {
  enableQR: enableQR,
  disableQR: disableQR
};
