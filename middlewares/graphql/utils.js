const test = (stuff)=>{
  return {
    flag: true,
    errors: null,
    user: null,
    token: jwt.sign({email: stuff.email}, process.env['jwt_secret'])
  }
};

const formatErrors = (e) => {
  console.log(e.code);
  if(e.name === 'JsonWebTokenError'){
    return "token is Invalid";
  }
  else if(e.code === 6){
    return "User Already exists";
  }
  return "Something Went Wrong";
};

module.exports = {
  test: test,
  formatErrors: formatErrors
};