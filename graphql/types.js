let {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt
} = require('graphql');

// Schema for Agile-wizard

// User details Schema
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

// Response for Authentication mutation
let authResponse = new GraphQLObjectType({
  name:'authResponse',
  fields: {
    flag: {type: GraphQLBoolean},
    errors: {type: GraphQLString},
    user: {type: userType},
    token: {type: GraphQLString}
  }
});

// Response for findUser
let queryResponse = new GraphQLObjectType({
  name: 'queryResponse',
  fields:{
    flag: {type: GraphQLBoolean},
    user: {type: userType},
    errors: {type: GraphQLString}
  }
});

// Response to the CreateUser Query
let registerResponse = new GraphQLObjectType({
  name: 'registerResponse',
  fields:{
    flag: {type: GraphQLBoolean},
    token: {type: GraphQLString},
    errors: {type: GraphQLString}
  }
});

// Feedback schema
let feedback = new GraphQLObjectType({
    name: 'feedback',
    fields:{
        email: {type: GraphQLString},
        response: {type: GraphQLString}
    }
});

// Fests schema common for user app
let userFeed = new GraphQLObjectType({
  name: 'userFeed',
  fields:{
    ID: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    venue: {type: new GraphQLNonNull(GraphQLString)},
    tags: {type: new GraphQLList(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    speakers: {type: new GraphQLList(GraphQLString)},
    contact: {type: new GraphQLList(GraphQLString)},
    link: {type: new GraphQLList(GraphQLString)},
  }
});

// Fests schema for innocent carpenter
let carpenterFeed = new GraphQLObjectType({
    name: 'carpenterFeed',
    fields:{
        ID: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        venue: {type: new GraphQLNonNull(GraphQLString)},
        tags: {type: new GraphQLList(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        speakers: {type: new GraphQLList(GraphQLString)},
        RSVP: {type: new GraphQLList(GraphQLString)},
        attendance : {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
        contact: {type: new GraphQLList(GraphQLString)},
        link: {type: new GraphQLList(GraphQLString)},
        feedback: {type: new GraphQLList(feedback)},
        isActive: {type: GraphQLBoolean}
    }
});

// Response for querying fests collection/ getFeed query
let feedResponse = new GraphQLObjectType({
    name: 'feedResponse',
    fields:{
        flag: {type: GraphQLBoolean},
        errors: {type: GraphQLString},
        feed: {type: new GraphQLList(userFeed)}
    }
});

let generalResponse = new GraphQLObjectType({
  name: 'addFeedResponse',
  fields:{
    flag: {type: GraphQLBoolean},
    errors: {type: GraphQLString}
  }
});

let festResponse = new GraphQLObjectType({
  name: 'festResponse',
  fields:{
    flag: {type: GraphQLBoolean},
    errors: {type: GraphQLString},
    fest: {type: carpenterFeed}
  }
});

module.exports = {
  registerResponse: registerResponse,
  queryResponse: queryResponse,
  authResponse: authResponse,
  feedResponse: feedResponse,
  generalResponse: generalResponse,
  festResponse: festResponse
};
