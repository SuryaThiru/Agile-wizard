const userModel = require('../models/user.js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
let serviceaccount = require('./skindoc-10ef5-firebase-adminsdk-hye37-c5e3f153c1.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceaccount),
    databaseURL: "https://skindoc-10ef5.firebaseio.com"
});
let db = admin.firestore();

let {
    GraphQLString,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLBoolean
} = require('graphql');

const bcrypt = require('bcrypt');

// functions
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
// *End Functions*

// Types
let userType = new GraphQLObjectType({
   name: 'User',
   fields:{
       email:{type: new GraphQLNonNull(GraphQLString)},
       fname:{type: new GraphQLNonNull(GraphQLString)},
       lname:{type: new GraphQLNonNull(GraphQLString)},
       phone:{type: new GraphQLNonNull(GraphQLString)},
       reg:{type: GraphQLString},
       password:{type: new GraphQLNonNull(GraphQLString)},
       google:{type: new GraphQLNonNull(GraphQLBoolean)},
       gender:{type: new GraphQLNonNull(GraphQLString)}
   }
});

let feed = new GraphQLObjectType({
    name: 'weekly_feed',
    fields:{
        status_code: {type: GraphQLString},
        Type: {type: GraphQLString},
        description: {type: GraphQLString},
        link: {type: GraphQLString}
    }
});
// *End Types*

// Inputs
let userInput = new GraphQLInputObjectType({
    name: 'userInput',
    fields:{
        email:{type: new GraphQLNonNull(GraphQLString)},
        fname:{type: new GraphQLNonNull(GraphQLString)},
        lname:{type: new GraphQLNonNull(GraphQLString)},
        phone:{type: new GraphQLNonNull(GraphQLString)},
        reg:{type: GraphQLString},
        password:{type: new GraphQLNonNull(GraphQLString)},
        google:{type: new GraphQLNonNull(GraphQLBoolean)},
        gender:{type: new GraphQLNonNull(GraphQLString)}
    }
});

let viewerInput = new GraphQLInputObjectType({
    name: 'Viewer',
    fields:{
        token:{type: new GraphQLNonNull(GraphQLString)}
    }
});
// *End Inputs*

// Responses
let RegisterResponse = new GraphQLObjectType({
    name:'RegisterResponse',
    fields: {
        flag: {type: GraphQLBoolean},
        errors: {type: GraphQLString},
        user: {type: userType},
        token: {type: GraphQLString}
    }
});

let queryResponse = new GraphQLObjectType({
   name: 'queryResponse',
   fields:{
       flag: {type: GraphQLBoolean},
       user: {type: userType},
       errors: {type: GraphQLString}
   }
});

let authResponse = new GraphQLObjectType({
    name: 'authResponse',
    fields:{
        flag: {type: GraphQLBoolean},
        token: {type: GraphQLString},
        errors: {type: GraphQLString}
    }
});
// *End Responses*

let queryType = new GraphQLObjectType({
    name: 'Query',
    fields:{
        findUser:{
            type: RegisterResponse,
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
           type: RegisterResponse,
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
                       return obj;
                   }).catch((err)=>{
                       return {
                           flag: false,
                           user: null,
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
                           errors: "Invalid password.",
                           token: null
                       }
                   }
                   else {
                       return bcrypt.compare(password, dat.password).then((res) => {
                           if (res) {
                               return {
                                   flag: true,
                                   errors: null,
                                   token: jwt.sign({email: email}, process.env['jwt_secret'])
                               }
                           }
                           else {
                               return {
                                   flag: false,
                                   errors: "something is wrong",
                                   token: null,
                               }
                           }
                       }).catch(err => {
                           return {
                               flag: false,
                               errors: err.message,
                               token: null,
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
