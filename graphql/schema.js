const { gql } = require('apollo-server');
const models = require('../models');
const JWT = require('jsonwebtoken');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const _ = require('lodash');
const { withFilter } = require('graphql-subscriptions');
const pubSub = require('./pubsub');

const User = require('./types/user');
const Support = require('./types/support');
const Chat = require('./types/chat');

const typeDefs = gql`
  ${User.typeDefs()}
  ${Support.typeDefs()}
  ${Chat.typeDefs()}

  scalar Upload

  type Query {
    user(id: Int!): User
    currentUser: User
    chatHistory(to_user: Int!): [Chat]
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
    newMessage(message: String!, to_user: Int!): Message
    readMessage(from_user: Int!): Message
  }

  type Subscription {
    newMessage(to_user: Int!): ChatMessage
    readMessage(from_user: Int!): Message
  }
`;

function combineResolvers() {
  return _.merge(
    {
      Subscription: {
        newMessage: {
          subscribe: withFilter(
            () => pubSub.asyncIterator('NEW_MESSAGE'),
            (payload, args) => {
              return payload.newMessage.to_user === args.to_user;
            },
          ),
        },
        readMessage: {
          subscribe: withFilter(
            () => pubSub.asyncIterator('READ_MESSAGE'),
            (payload, args) => {
              return payload.readMessage.from_user === args.from_user;
            },
          ),
        },
      },
    },
    User.resolver(),
    Support.resolver(),
    Chat.resolver(),
  );
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: combineResolvers(),
});

const context = async ({ req }) => {
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
};

module.exports = {
  schema,
  context,
};
