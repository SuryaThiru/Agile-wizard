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
      resolve: findUser
    },
    getFeed: {
      type: feedResponse,
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
        festInput: {type: festInput}
      },
      resolve: createFest
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
    removeFest: {
      type: generalResponse,
      args: {
        festID: {type: GraphQLString}
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
