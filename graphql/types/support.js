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
    type Message {
        message: String
    }
    `;
  }
};
