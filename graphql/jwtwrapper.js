/*
  module wraps the jwt verification methods
   used in the responses of the graphql requests
 */
const {formatErrors} = require('./utils');
const jwt = require('jsonwebtoken');


function jwtErrorHandler(err) {
  console.log(err);
  let message = formatErrors(err);

  return {
    flag: false,
    errors: message,
    fest: null
  };
}

function jwtVerify(token, callback) {
  // TODO decoded token handler
  return jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return jwtErrorHandler(err);
    }

    return callback(decoded);
  });
}

module.exports = jwtVerify;
