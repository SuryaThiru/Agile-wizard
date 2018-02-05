const QRcode = require('qrcode');

function getQR(value) {
  // returns a promise that resolves to a data url

  return QRcode.toDataURL(value);
}

module.exports = getQR;
