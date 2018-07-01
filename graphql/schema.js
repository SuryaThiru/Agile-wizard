/*
  Contains the schema for the graphql server
  exports a GraphQLSchema
 */

const {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const {
  registerResponse,
  authResponse,
  queryResponse,
  festCarpenterResponse,
  festUserResponse,
  generalResponse,
  festResponse,
  blogResponse,
  blogsResponse
} = require('./types');

const {
  userInput,
  userEditInput,
  viewerInput,
  festInput,
  festEdit,
  blogInput,
  blogEditInput
} = require('./inputs');

const {
  findUser,
  getCarpenterFests,
  getUserFests,
  createUser,
  editUser,
  authenticate,
  createFest,
  editFest,
  toggleFest,
  enableQr,
  disableQr,
  updateAttendance,
  verify,
  removeFest,
  changePassword,
  addFeedback,
  addRSVP,
  addBlog,
  editBlog,
  getBlogs
} = require('./resolvers');


let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    findUser: {
      type: queryResponse,
      resolve: findUser
    },
    getCarpenterFests: {
      type: festCarpenterResponse,
      resolve: getCarpenterFests
    },
    getUserFests: { // TODO add docs
      type: festUserResponse,
      resolve: getUserFests
    },
    getBlogs: {
      type: blogsResponse,
      args: {
        count: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: getBlogs
    }
  }
});


let mutationType = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    createUser: {
      type: registerResponse,
      args: {
        input: {type: userInput}
      },
      resolve: createUser
    },
    editUser: {
      type: registerResponse,
      args: {
        user: {type: userEditInput}
      },
      resolve: editUser
    },
    authenticate: {
      type: authResponse,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve: authenticate
    },
    createFest: {
      type: festResponse,
      args: {
        festInput: {type: festInput}
      },
      resolve: createFest
    },
    removeFest: {
      type: generalResponse,
      args: {
        festID: {type: GraphQLString}
      },
      resolve: removeFest
    },
    editFest: {
      type: festResponse,
      args: {
        ID: {type: GraphQLString},
        festInput: {type: festEdit}
      },
      resolve: editFest
    },
    toggleFest: {
      type: generalResponse,
      args: {
        ID: {type: GraphQLString}
      },
      resolve: toggleFest
    },
    addBlog: {
      type: blogResponse,
      args: {
        blogPost: {type: blogInput}
      },
      resolve: addBlog
    },
    editBlog: {
      type: generalResponse,
      args: {
        ID: {type: GraphQLString},
        blogPost: {type: blogEditInput}
      },
      resolve: editBlog
    },
    enableQr: {
      type: generalResponse,
      args: {
        festID: {type: GraphQLString},
        viewer:{type: viewerInput}
      },
      resolve: enableQr
    },
    disableQr: {
      type: generalResponse,
      args: {
        festID: {type: GraphQLString},
        viewer:{type: viewerInput}
      },
      resolve: disableQr
    },
    updateAttendance: {
      type: generalResponse,
      args: {
        festID: {type: new GraphQLNonNull(GraphQLString)},
        code: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: updateAttendance
    },
    addFeedback: {
      type: generalResponse,
      args: {
        festID: {type: new GraphQLNonNull(GraphQLString)},
        feedback: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: addFeedback
    },
    addRSVP: {
      type: generalResponse,
      args: {
        festID: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: addRSVP
    },
    verify: {
      type: generalResponse,
      args: {
        viewer: {type: viewerInput}
      },
      resolve: verify
    },
    changePassword: {
      type: generalResponse,
      args: {
        email: {type: GraphQLString},
        option: {type: GraphQLInt},
        viewer: {type: viewerInput},
        password: {type: GraphQLString}
      },
      resolve: changePassword
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports.schema = schema;
