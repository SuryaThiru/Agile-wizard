const sgMail = require('@sendgrid/mail');
const fs = require('fs');

console.log(process.env['sendgrid']);

sgMail.setApiKey(process.env['sendgrid']);

function renderTemplate(message) {
  let htm = fs.readFileSync("../graphql/views/template.html");
  let data = String(htm);

  data = data.replace('##emailid##',message.email)
    .replace('##link##',message.link).replace('##name##',message.fname);

  return data;
}

function constructMessage(to_email, message) {
  let data = renderTemplate(message);

  console.log(to_email);
  return {
    to: to_email,
    from: 'onimusha702@gmail.com',
    subject: 'Verify your account',
    text: 'Verify signup to activate your account',
    html: data
  };
}

function sendSignUpVerificationMail(userData, token) {
  // TODO verification route
  userData.link = 'http://localhost:3000/verify' + token;
  let construct = constructMessage(userData.email, userData);

  return sgMail.send(construct)
    .then(_ => {
      console.log('Signup verification email sent');
    }).catch(err => {
      console.log('Error sending verification email ');
      console.log(err);
    });
}

module.exports = sendSignUpVerificationMail;
