/*
  Contains the schema for the graphql server
  exports a GraphQLSchema
 */

const {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt
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
  festInput
} = require('./inputs');

const {
  findUser,
  getFeed,
  createUser,
  authenticate,
  createFest,
  toggleFest,
  enableQr,
  updateAttendance,
  verify,
  removeFest
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
        ID: {type: GraphQLString},
        viewer:{type: viewerInput},
        timelimit: {type: GraphQLInt}
      },
      resolve: enableQr
    },
    updateAttendance: {
      type: generalResponse,
      args: {
        festID: {type: GraphQLString},
        viewer: {type: viewerInput},
        code: {type: GraphQLString}
      },
      resolve: updateAttendance
    },
    verify: {
      type: generalResponse,
      args: {
        viewer:{type: viewerInput}
      },
      resolve: verify
    },
    removeFest:{
      type: generalResponse,
      args:{
        festID : {type: GraphQLString},
        viewer: {type: viewerInput}
      },
      resolve: removeFest
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

module.exports.schema = schema;
