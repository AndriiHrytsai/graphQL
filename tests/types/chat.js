// ************************************* QUERIES *****************************************
const chatHistory = (toUser) => `query {
  chatHistory(to_user: ${toUser}) {
    message
  }
}`;

// ************************************* MUTATIONS *****************************************

const newMessage = (message, toUser) => `mutation {
  newMessage(message: ${message}, to_user: ${toUser}) {
    message
  }
}`;

const readMessage = (fromUser) => `mutation {
  readMessage(from_user: ${fromUser}) {
    message
  }
}`;

module.exports = {
  chatHistory,
  newMessage,
  readMessage,
};
