const jwt = require('jsonwebtoken');


const test = (stuff)=>{
  return {
    flag: true,
    errors: null,
    token: jwt.sign({email: stuff.email}, process.env.jwt_secret)
  };
};

const formatErrors = (e) => {
  console.log(e.code);
  if(e.name === 'JsonWebTokenError'){
    return "Token is Invalid";
  }
  else if(e.code === 6){
    return "User Already exists";
  }
  return e.message;
};

const validate =  (email)=>{
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
};


module.exports = {
  test: test,
  formatErrors: formatErrors,
  validate: validate
};
