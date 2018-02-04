/*
  Contains the schema for the graphql server
  exports a GraphQLSchema
 */


const { buildSchema } = require('graphql');

let schema = buildSchema(`  
  type Fest {
      id: ID!,
      name: String!,
      venue: String!,
      tags: [String]!,
      description: String!,
      speakers: [String],
      contact: [String],
      RSVPs: [String],
      attendance: [String],
      feedback: [Feedback]
  }
  
  type User {
    firstname: String!,
    lastname: String,
    email: String!,
    regno: String,
    mobile: String,
    gender: String,    
  }
  
  type Blog {
    author: String!,
    content: String!,
    tags: [String]!,
    read: [String],
    liked: [String]  
  }
  
  type Manager {
    firstname: String!,
    lastname: String,
    email: String!,
    password: String,
  }
  
  enum Feedback {
    HAPPY
    OKAY
    SAD
   }
`);

// TODO password hash, check all types with design

module.export = schema;
