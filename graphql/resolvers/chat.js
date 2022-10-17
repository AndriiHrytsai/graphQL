const models = require('../../models');
const { SevenBoom } = require('graphql-apollo-errors');
const pubSub = require('../pubsub');

const chatResolver = {
  async chatHistory(root, { to_user }, context) {
    return models.chatModel.findAll({
      where: {
        to_user: to_user,
        from_user: context.user.id,
      },
      order: [['createdAt', 'ASC']],
    });
  },

  async newMessage(root, chatData, context) {
    const findUser = await models.userModel.findByPk(chatData.to_user);
    if (!findUser) {
      throw SevenBoom.conflict('This user in not defined');
    }

    await models.chatModel.create({
      ...chatData,
      from_user: context.user.id,
    });
    await pubSub.publish('NEW_MESSAGE', {
      newMessage: { ...chatData, from_user: context.user.id },
    });
    return { message: 'Message successfully sent' };
  },

  async readMessage(root, chatData, context) {
    await models.chatModel.update(
      {
        is_read: true,
      },
      {
        where: {
          from_user: context.user.id,
          to_user: chatData.from_user,
          is_read: false,
        },
      },
    );

    await pubSub.publish('READ_MESSAGE', { readMessage: chatData });
    return { message: 'Message is already has been read' };
  },
};

module.exports = chatResolver;
