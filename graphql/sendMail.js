// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";

console.log(process.env.sendgrid);
sgMail.setApiKey(process.env.sendgrid);

const msg = {
  to: 'amrut546@gmail.com',
  from: 'onimusha702@gmail.com',
  subject: 'Hey buddy!',
  text: 'why is this not working',
  html: '<strong>hola amigo i am just testing this out</strong>',
};
// expects the message to be in the following format
// msg{
//     to:<>,
//     subject:<>,
//     text:<>,
// }
function constructMessage(Message){

}
// return sgMail.send(msg).then((dat)=>{
//     // console.log("inside send fulfill amigo ",dat);
//     function omega(){return{
//         flag: true,
//         test: true
//     }}
//     return omega();
// }).then((resp)=>{
//     console.log(resp);
//     return resp;
// }).catch((err)=>{
//     console.log("there was an error ", err);
//     return{
//         flag: false,
//         test: false
//     }
// });


// module.exports.message = msg;