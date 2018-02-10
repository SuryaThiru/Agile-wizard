const QRcode = require('qrcode');

function getQR(value) {
  // returns a promise that resolves to a data url

  return QRcode.toDataURL(value);
}

getQR("9t6NFkN33v4jYd3cil3V").then(dat => {
  console.log(dat);
}).catch(err => {
  console.log(err);
});
module.exports = getQR;
