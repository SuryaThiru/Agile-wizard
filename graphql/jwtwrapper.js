/*
  module wraps the jwt verification methods
   used in the responses of the graphql requests
 */
function jwtVerify(user,errs,auth_level,callback) {
  if (!user){
    if(errs){
      return {
        status_code: 420,
        errors: errs
      }
    }
    return {
      status_code: 420,
      errors: 'Not authenticated'
    };
  }
  if (user.auth_level<=auth_level){
    return {
      status_code: 420,
      errors: 'Unauthorized'
    };
  }
    return callback(user);
}

module.exports = jwtVerify;
