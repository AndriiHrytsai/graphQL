const { gql } = require('apollo-server');
const resolvers = require('../resolvers/resolvers');
const models = require('../models');
const JWT = require('jsonwebtoken');

const typeDefs = gql`
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

  type Query {
    user(id: Int!): User
    currentUser: User
    changePassword(token: String!, password: String!): forgotPassword
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
    deleteForgotPasswordToken: forgotPassword
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
