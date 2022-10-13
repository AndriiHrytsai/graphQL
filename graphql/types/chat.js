const ChatResolver = require('../resolvers/chat');

module.exports = class Chat {
  static resolver() {
    return {
      Query: {
        chatHistory: ChatResolver.chatHistory,
      },
      Mutation: {
        newMessage: ChatResolver.newMessage,
        readMessage: ChatResolver.readMessage,
      },
    };
  }

  static typeDefs() {
    return `
        type ChatMessage {
            message: String!
            to_user: Int!
            from_user: Int!
        }
        
        type Chat {
            message: String!
            from_user: Int!
            to_user: Int!
        }
        
        type readMessage {
            message_id: [Int]!
        }
        
        type Message {
            message: String
        }
    `;
  }
};
