const { gql } = require('apollo-server');
const resolvers = require('../resolvers/resolvers');
const models = require('../models');
const JWT = require('jsonwebtoken');

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
  type forgotPassword {
    message: String
  }
  type updateUser {
    message: String
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
    forgotPassword(email: String!): forgotPassword
    changePassword(token: String!, password: String!): forgotPassword
    updateUser(
      first_name: String
      last_name: String
      email: String
      password: String
    ): updateUser
    connectWithUs(title: String!, description: String!, file: Upload): forgotPassword
  }
`;

const schema = {
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const context = {
      user: null,
      req: req,
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
  },
};

module.exports = schema;
