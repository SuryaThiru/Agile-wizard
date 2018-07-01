let {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

// Schema for Agile-wizard

// User details Schema
let userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    email: {type: new GraphQLNonNull(GraphQLString)},
    fname: {type: new GraphQLNonNull(GraphQLString)},
    lname: {type: new GraphQLNonNull(GraphQLString)},
    phone: {type: new GraphQLNonNull(GraphQLString)},
    reg: {type: GraphQLString},
    password: {type: new GraphQLNonNull(GraphQLString)},
    google: {type: new GraphQLNonNull(GraphQLBoolean)},
    gender: {type: new GraphQLNonNull(GraphQLString)},
    auth_level: {type: new GraphQLNonNull(GraphQLString)}
  }
});

// Response for Authentication mutation
let authResponse = new GraphQLObjectType({
  name:'authResponse',
  fields: {
    status_code: {type: GraphQLInt},
    errors: {type: GraphQLString},
    user: {type: userType},
    token: {type: GraphQLString}
  }
});

// Response for findUser
let queryResponse = new GraphQLObjectType({
  name: 'queryResponse',
  fields: {
    status_code: {type: GraphQLInt},
    user: {type: userType},
    errors: {type: GraphQLString}
  }
});

// Response to the CreateUser Query
let registerResponse = new GraphQLObjectType({
  name: 'registerResponse',
  fields: {
    status_code: {type: GraphQLInt},
    errors: {type: GraphQLString}
  }
});

// Feedback schema
let feedback = new GraphQLObjectType({
    name: 'feedback',
    fields: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        response: {type: new GraphQLNonNull(GraphQLString)}
    }
});

// Fests schema common for user app
let userFeed = new GraphQLObjectType({
  name: 'userFeed',
  fields: {
    ID: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    venue: {type: new GraphQLNonNull(GraphQLString)},
    tags: {type: new GraphQLList(GraphQLString)},
    description: {type: new GraphQLNonNull(GraphQLString)},
    speakers: {type: new GraphQLList(GraphQLString)},
    contact: {type: new GraphQLList(GraphQLString)},
    link: {type: new GraphQLList(GraphQLString)},
    isActive: {type: GraphQLBoolean},
    fromDate: {type: GraphQLString}, // ISO format eg: 2018-05-14T09:22:42.232Z
    toDate: {type: GraphQLString}    // default date format in JS
  }
});

// Fests schema for innocent carpenter
let carpenterFeed = new GraphQLObjectType({
    name: 'carpenterFeed',
    fields: {
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
        isActive: {type: GraphQLBoolean},
        QRcode: {type: GraphQLString},
        fromDate: {type: GraphQLString}, // ISO format eg: 2018-05-14T09:22:42.232Z
        toDate: {type: GraphQLString}    // default date format in JS
    }
});

// blogposts schema
let blogPost = new GraphQLObjectType({
  name: 'blogPost',
  fields: {
    ID: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString)},
    date: {type: new GraphQLNonNull(GraphQLString)}, // ISO string
    description: {type: new GraphQLNonNull(GraphQLString)},
    tags: {type: new GraphQLList(GraphQLString)},
    author: {type: new GraphQLNonNull(GraphQLString)},
    link: {type: new GraphQLNonNull(GraphQLString)}
  }
});

let blogResponse = new GraphQLObjectType({
  name: 'blogResponse',
  fields: {
    status_code: {type: GraphQLInt},
    errors: {type: GraphQLString},
    blog: {type: blogPost}
  }
});

let blogsResponse = new GraphQLObjectType({
  name: 'blogsResponse',
  fields: {
    status_code: {type: GraphQLInt},
    errors: {type: GraphQLString},
    blogs: {type: new GraphQLList(blogPost)}
  }
});

// Response for querying fests collection/ getFeed query
let feedResponse = new GraphQLObjectType({
    name: 'feedResponse',
    fields: {
        status_code: {type: GraphQLInt},
        errors: {type: GraphQLString},
        feed: {type: new GraphQLList(userFeed)}
    }
});

let generalResponse = new GraphQLObjectType({
  name: 'addFeedResponse',
  fields: {
    status_code: {type: GraphQLInt},
    errors: {type: GraphQLString}
  }
});

let festCarpenterResponse = new GraphQLObjectType({
  name: 'festCarpenterResponse',
  fields: {
    status_code: {type: GraphQLInt},
    errors: {type: GraphQLString},
    fests: {type: new GraphQLList(carpenterFeed)}
  }
});

let festResponse = new GraphQLObjectType({
  name: 'festResponse',
  fields: {
    status_code: {type: GraphQLInt},
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
  festCarpenterResponse: festCarpenterResponse,
  festResponse: festResponse,
  blogPost: blogPost,
  blogResponse: blogResponse,
  blogsResponse: blogsResponse
};
