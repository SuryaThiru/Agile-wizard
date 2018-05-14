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
  feedResponse,
  generalResponse,
  festResponse
} = require('./types');

const {
  userInput,
  viewerInput,
  festInput,
  festEdit
} = require('./inputs');

const {
  findUser,
  getFeed,
  createUser,
  authenticate,
  createFest,
  editFest,
  deleteFest,
  toggleFest,
  enableQr,
  disableQr,
  updateAttendance,
  verify,
  removeFest,
  changePassword,
  addFeedback,
  addRSVP
} = require('./resolvers');


let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    findUser: {
      type: queryResponse,
      args: {
        viewer: {type: viewerInput }
      },
      resolve: findUser
    },
    getFeed: {
      type: feedResponse,
      args: {
        viewer: {type: viewerInput}
      },
      resolve: getFeed
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
        viewer: {type: viewerInput},
        festInput: {type: festInput}
      },
      resolve: createFest
    },
    editFest: {
      type: festResponse,
      args: {
        viewer: {type: viewerInput},
        ID: {type: GraphQLString},
        festInput: {type: festEdit}
      },
      resolve: editFest
    },
    deleteFest: {
      type: generalResponse,
      args: {
        viewer: {type: viewerInput},
        ID: {type: GraphQLString}
      },
      resolve: deleteFest
    },
    toggleFest: {
      type: generalResponse,
      args: {
        viewer: {type: viewerInput},
        ID: {type: GraphQLString}
      },
      resolve: toggleFest
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
        viewer: {type: new GraphQLNonNull(viewerInput)},
        code: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: updateAttendance
    },
    addFeedback: {
      type: generalResponse,
      args: {
        festID: {type: new GraphQLNonNull(GraphQLString)},
        viewer: {type: new GraphQLNonNull(viewerInput)},
        feedback: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: addFeedback
    },
    addRSVP: {
      type: generalResponse,
      args: {
        festID: {type: new GraphQLNonNull(GraphQLString)},
        viewer: {type: new GraphQLNonNull(viewerInput)}
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
    removeFest: {
      type: generalResponse,
      args: {
        festID: {type: GraphQLString},
        viewer: {type: viewerInput}
      },
      resolve: removeFest
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
