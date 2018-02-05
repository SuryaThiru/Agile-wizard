let {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLBoolean
} = require('graphql');


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

module.exports = {
  userInput: userInput,
  viewerInput: viewerInput
};
