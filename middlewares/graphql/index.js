let {schema} = require('./schema');
const graphqlHTTP = require('express-graphql');

graphqlHTTP({
  schema: schema,
  graphiql: true
});

module.exports = graphqlHTTP;
