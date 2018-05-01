import jwt from "jsonwebtoken";
import fs from "fs";

let htm = fs.readFileSync("../Other/template.html");

const replaceString = (message) =>{
  let data = String(htm);
  data = data.replace('##emailid##',message.email)
    .replace('##link##',message.link).replace('##name##',message.fname);
  return data;
};

const test = (stuff)=>{
  return {
    flag: true,
    errors: null,
    token: jwt.sign({email: stuff.email}, process.env.jwt_secret)
  };
};

const constructMessage = (email, message) =>{
  let data = replaceString(message);
  return {
    to: email,
    from: 'onimusha702@gmail.com',
    subject: 'Verify your account',
    text: 'balls and balls',
    html: data,
  };
};

const formatErrors = (e) => {
  console.log(e.code);
  if(e.name === 'JsonWebTokenError'){
    return "token is Invalid";
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


export default {
  test: test,
  formatErrors: formatErrors,
  constructMessage: constructMessage,
  validate: validate
};
