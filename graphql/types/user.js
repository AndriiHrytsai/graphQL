const UserResolver = require('../resolvers/user');

module.exports = class User {
  static resolver() {
    return {
      Query: {
        user: UserResolver.user,
        currentUser: (root, args, context) => context.user,
      },
      Mutation: {
        createUser: UserResolver.createUser,
        login: UserResolver.login,
        forgotPassword: UserResolver.forgotPassword,
        changePassword: UserResolver.changePassword,
        updateUser: UserResolver.updateUser,
      },
    };
  }

  static typeDefs() {
    return `
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
    `;
  }
};
