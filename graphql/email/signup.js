const sgMail = require('@sendgrid/mail');
const fs = require('fs');

const sgApi = process.env['sendgrid'];
console.log(sgApi);
sgMail.setApiKey(sgApi);

function renderTemplate(message) {
  let htm = fs.readFileSync("graphql/views/template.html");
  let data = String(htm);

  data = data.replace('##emailid##',message.email)
    .replace('##link##',message.link).replace('##name##',message.fname);

  return data;
}

function constructMessage(email_details, message) {
  let data = renderTemplate(message);

  console.log(email_details);
  return {
    to: email_details.to,
    from: 'dscvitvellore@gmail.com',
    subject: email_details.subject,
    text: email_details.text,
    html: data
  };
}

function sendVerificationMail(userData, token, email_details) {
  // TODO verification route
  userData.link = 'https://connectx.dscvit.com/verify/' + token;
  let construct = constructMessage(email_details, userData);

  return sgMail.send(construct)
    .then(() => {
      console.log('Signup verification email sent');
    }).catch(err => {
      console.log('Error sending verification email ');
      console.log(err);
    });
}

module.exports = sendVerificationMail;
