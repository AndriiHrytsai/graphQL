const SupportResolver = require('../resolvers/support');

module.exports = class Support {
  static resolver() {
    return {
      Mutation: {
        connectWithUs: SupportResolver.connectWithUs,
      },
    };
  }

  static typeDefs() {
    return `
    input UserInput {
        email: String!
        password: String!
        firstName: String
        middleName: String
        lastName: String
        photo: Upload
    }

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
