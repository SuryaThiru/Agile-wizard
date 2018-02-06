/*
  Contains the schema for the graphql server
  exports a GraphQLSchema
 */

const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const message = {
    to: 'amrut546@gmail.com',
    from: 'onimusha702@gmail.com',
    subject: 'Hey buddy!',
    text: 'is this working',
    html: '<strong>Html test</strong>'
};
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env['sendgrid']);

const {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql');

const {
  registerResponse,
  authResponse
} = require('./types');

const {
  userInput,
  viewerInput
} = require('./inputs');

const {
  test,
  formatErrors
} = require('./utils');

let serviceaccount = require('../config/skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1');
admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
  databaseURL: "https://skindoc-10ef5.firebaseio.com"
});
let db = admin.firestore();

let queryType = new GraphQLObjectType({
  name: 'Query',
  fields:{
    findUser:{
      type: registerResponse,
      args: {
        viewer: {type: viewerInput }
      },
      resolve: (root, something)=>{
        if (!something.viewer){
          return {
            flag: false,
            user: null,
            errors: "Token is invalid."
          }
        }
        let {token} = something.viewer;
        return jwt.verify(token, process.env['jwt_secret'], (err, decoded)=>{
          if(err) {
            let message = formatErrors(err);
            return {
              flag: false,
              user: null,
              errors: message
            }
          }
          let {email} = decoded;
          return db.collection("users").doc(email).get().then((doc)=>{
            if(!doc.exists){
              return{
                flag: false,
                user: null,
                errors: "user does not exist"
              }
            }
            else{
              console.log(doc.data());
              return doc.data();
            }
          }).then((dat)=>{
            return {
              flag: true,
              user: dat,
              errors: null
            }
          });
        });
      }
    }
  }
});

let mutationType = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    createUser: {
      type: registerResponse,
      args: {
        input: {type: userInput}
      },
      resolve: (root, params) => {
        params.input.password = bcrypt.hashSync(params.input.password, 10);

        let users = db.collection('users').doc(params.input.email);
        let userData = JSON.parse(JSON.stringify(params.input));

        return users.create(userData).then(()=>{
          return test(params.input);
        }).then((obj)=>{
          console.log(obj);
          return sgMail.send(message).then(()=>{
            function omega(){
              return obj;
            }
            return omega();
          }).then((dat)=>{
            return dat;
          }).catch((err)=>{
            console.log('inside catch 1');
            return {
              flag: false,
              token: false,
              errors: formatErrors(err)
            }
          });
        }).catch((err)=>{
          return {
            flag: false,
            token: null,
            errors: formatErrors(err)
          }
        });
      }
    },
    authenticate:{
      type: authResponse,
      args:{
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve: (root, params)=>{
        let {password, email} = params;
        return db.collection("users").doc(email).get().then((doc)=>{
          if(!doc.exists)
            return false;
          else
            return doc.data();
        }).then((dat)=>{
          console.log(dat);
          if(!dat){
            return{
              flag: true,
              errors: "Invalid username",
              user: null,
              token: null
            }
          }
          else {
            return bcrypt.compare(password, dat.password).then((res) => {
              if (res) {
                return {
                  flag: true,
                  errors: null,
                  user: dat,
                  token: jwt.sign({email: email}, process.env['jwt_secret'])
                }
              }
              else {
                return {
                  flag: false,
                  errors: "Invalid Password.",
                  user: dat,
                  token: null
                }
              }
            }).catch(err => {
              return {
                flag: false,
                errors: err.message,
                user: dat,
                token: null
              }
            });
          }
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports.schema = schema;
