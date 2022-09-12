const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: Int!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    access_token: String
    reset_password_token: String
   }
  
  type Login {
    access_token: String
  }

  type Query {
    user(id: Int!): User
    getAllUsers: [User]
  }

  type Mutation {
    createUser(
      first_name: String!
      last_name: String!
      email: String!
      password: String!
    ): User!
    login(email: String!, password: String!): Login
  }
`;

module.exports = typeDefs;
