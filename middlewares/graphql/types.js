let {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql');

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

let registerResponse = new GraphQLObjectType({
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

module.exports = {
  registerResponse: registerResponse,
  queryResponse: queryResponse,
  authResponse: authResponse,
  userType: userType,
  feed: feed
};
