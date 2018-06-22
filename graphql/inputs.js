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

// user edit form inputs
let userEditInput = new GraphQLInputObjectType({
  name: 'userEditInput',
  fields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    fname: {type: GraphQLString},
    lname: {type: GraphQLString},
    phone: {type: GraphQLString},
    reg: {type: GraphQLString},
    password: {type: GraphQLString},
    google: {type: GraphQLBoolean},
    gender: {type: GraphQLString}
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
    fromDate: {type: GraphQLString}, // ISO format eg: 2018-05-14T09:22:42.232Z
    toDate: {type: GraphQLString}    // default date format in JS
  }
});

let festEdit = new GraphQLInputObjectType({
  name: 'festEdit',
  fields: {
    name: {type: GraphQLString},
    venue: {type: GraphQLString},
    tags: {type: new GraphQLList(GraphQLString)},
    description: {type: GraphQLString},
    speakers: {type: new GraphQLList(GraphQLString)},
    contact: {type: new GraphQLList(GraphQLString)},
    link: {type: new GraphQLList(GraphQLString)},
    isActive: {type: GraphQLBoolean},
    RSVP: {type: new GraphQLList(GraphQLString)},
    attendance : {type: new GraphQLList(GraphQLString)},
    feedback: {type: new GraphQLList(GraphQLString)},
    fromDate: {type: GraphQLString}, // ISO format eg: 2018-05-14T09:22:42.232Z
    toDate: {type: GraphQLString}    // default date format in JS
  }
});

// create blog type
let blogInput = new GraphQLInputObjectType({
  name: 'blogInput',
  fields: {
    title: {type: new GraphQLNonNull(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    tags: {type: new GraphQLList(GraphQLString)},
    author: {type: new GraphQLNonNull(GraphQLString)},
    link: {type: new GraphQLNonNull(GraphQLString)}
  }
});

// edit blog type
let blogEditInput = new GraphQLInputObjectType({
  name: 'blogEditInput',
  fields: {
    title: {type: GraphQLString},
    description: {type: GraphQLString},
    tags: {type: new GraphQLList(GraphQLString)},
    author: {type: GraphQLString},
    link: {type: GraphQLString}
  }
});

module.exports = {
  userInput: userInput,
  userEditInput: userEditInput,
  viewerInput: viewerInput,
  festInput: festInput,
  festEdit: festEdit,
  blogInput: blogInput,
  blogEditInput: blogEditInput
};
