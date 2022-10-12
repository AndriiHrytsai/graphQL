const { gql } = require('apollo-server');
const resolvers = require('../resolvers/resolvers');
const models = require('../models');
const JWT = require('jsonwebtoken');
const { makeExecutableSchema } = require("@graphql-tools/schema");

const typeDefs = gql`
  scalar Upload

  type User {
    id: Int!
    first_name: String!
    last_name: String!
    email: String!
  }

  type Login {
    access_token: String
  }
  
  type Message {
    message: String
  }
  type ChatMessage {
    chat_id: Int!
    message: String!
    to_user: Int!
   }
   
   type readMessage {
    chat_id: Int!
    message_id: [Int]!
    to_user: Int!
   }

  type Query {
    user(id: Int!): User
    currentUser: User
  }

  type Mutation {
    createUser(
      first_name: String!
      last_name: String!
      email: String!
      password: String!
    ): User!
    login(email: String!, password: String!): Login
    forgotPassword(email: String!): Message
    changePassword(token: String!, password: String!): Message
    updateUser(
      first_name: String
      last_name: String
      email: String
      password: String
    ): Message
    connectWithUs(title: String!, description: String!, file: Upload): Message
    newMessage(chat_id: Int!, message: String!, to_user: Int!): Message
    readMessage(chat_id: Int!, message_id: [Int!]!, to_user: Int!): Message
  }
  
  type Subscription {
    newMessage(chat_id: Int): ChatMessage
    readMessage(chat_id: Int): readMessage
  }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const context = async ({ req }) => {
    const context = {
        user: null,
        req: req
    };
    const bearerToken = req.headers.authorization;
    if (bearerToken === undefined) {
        return context;
    }
    const token = bearerToken.split(' ')[1];
    if (typeof token === 'undefined') {
        return context;
    }

    let decode;
    try {
        decode = JWT.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        if (e.name === JWT.TokenExpiredError.name) {
            return context;
        } else {
            return 'not valid';
        }
    }
    context.user = await models.userModel.findOne({
        where: { id: decode.sub },
    });

    return context;
}

module.exports = {
    schema, context
};
