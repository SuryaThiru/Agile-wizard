const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

// user create form inputs
let userInput = new GraphQLInputObjectType({
  name: 'userInput',
  fields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    fname: {type: new GraphQLNonNull(GraphQLString)},
    lname: {type: new GraphQLNonNull(GraphQLString)},
    phone: {type: new GraphQLNonNull(GraphQLString)},
    reg: {type: GraphQLString},
    password: {type: new GraphQLNonNull(GraphQLString)},
    google: {type: new GraphQLNonNull(GraphQLBoolean)},
    gender: {type: new GraphQLNonNull(GraphQLString)}
  }
});

let viewerInput = new GraphQLInputObjectType({
  name: 'Viewer',
  fields: {
    token: {type: new GraphQLNonNull(GraphQLString)}
  }
});

// Carpenter's input createFest
let festInput = new GraphQLInputObjectType({
  name: 'festInput',
  fields: {
    name: {type: new GraphQLNonNull(GraphQLString)},
    venue: {type: new GraphQLNonNull(GraphQLString)},
    tags: {type: new GraphQLList(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    speakers: {type: new GraphQLList(GraphQLString)},
    contact: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
    link: {type: new GraphQLList(GraphQLString)},
    isActive: {type: GraphQLBoolean},
    RSVP: {type: new GraphQLList(GraphQLString)},
    attendance : {type: new GraphQLList(GraphQLString)},
    feedback: {type: new GraphQLList(GraphQLString)},
    fromDate: {type: GraphQLString}, // ISO format eg: 2018-05-14T09:22:42.232Z
    toDate: {type: GraphQLString}    // default date format in JS
  }
});

module.exports = {
  userInput: userInput,
  viewerInput: viewerInput,
  festInput: festInput
};
