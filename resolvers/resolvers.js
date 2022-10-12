const bcrypt = require('bcryptjs');
const { mailHelper, tokenHelper, fileUpload } = require('../helpers');
const { SevenBoom } = require('graphql-apollo-errors');
const { withFilter } = require('graphql-subscriptions');
const models = require('../models');
const pubSub = require('../graphql/pubsub');

const resolvers = {
  Query: {
    async user(root, { id }) {
      return await models.userModel.findByPk(id);
    },
    async currentUser(root, {}, context) {
      return context.user;
    },
    async chatHistory(root, { chat_id }) {
      return models.chatModel.findAll({
        where: {
          chat_id: chat_id,
        },
        order: [['createdAt', 'ASC']],
      });
    },
  },
  Mutation: {
    async createUser(root, { first_name, last_name, email, password }) {
      const findUser = await models.userModel.findOne({
        where: { email: email },
      });

      if (findUser) {
        throw SevenBoom.badData('This email already exist');
      }

      return models.userModel.create({
        first_name,
        last_name,
        email,
        password: await bcrypt.hash(password, 10),
      });
    },

    async login(root, { email, password }) {
      const findUser = await models.userModel.findOne({
        where: { email: email },
      });
      if (findUser === null) {
        throw SevenBoom.conflict('This user in not defined');
      }

      const incorrectPassword = !bcrypt.compareSync(
        password,
        findUser.password,
      );
      if (incorrectPassword) {
        throw SevenBoom.conflict('Passwords not concur');
      }

      const access_token = tokenHelper.user.accessToken(
        findUser.id,
        findUser.email,
      );
      return { access_token };
    },

    async forgotPassword(root, { email }) {
      const findUser = await models.userModel.findOne({
        where: { email: email },
      });
      if (findUser === null) {
        return {
          message: 'The password change instruction has been sent successfully',
        };
      }
      const forgotPasswordHash = tokenHelper.user.forgotPasswordToken();
      await models.userModel.update(
        {
          reset_password_token: forgotPasswordHash,
        },
        {
          where: { email: email },
        },
      );
      await mailHelper.sendMail(email, 'Forgot password', {
        userName: findUser.first_name,
        forgotPasswordHash: forgotPasswordHash,
        email: findUser.email,
      });

      return {
        message: 'The password change instruction has been sent successfully',
      };
    },
    async changePassword(root, { token, password }) {
      const findUser = await models.userModel.findOne({
        where: { reset_password_token: token },
      });
      if (findUser === null) {
        throw SevenBoom.conflict('User not found');
      }
      let verifyForgotPasswordToken = tokenHelper.verifyToken.token(token);
      if (verifyForgotPasswordToken === null) {
        await models.userModel.update(
          {
            reset_password_token: null,
          },
          {
            where: { id: findUser.id },
          },
        );
        throw SevenBoom.conflict('Token not found');
      }

      await models.userModel.update(
        {
          password: await bcrypt.hash(password, 10),
          reset_password_token: null,
        },
        {
          where: { id: findUser.id },
        },
      );
      return {
        message: 'Password successfully changed',
      };
    },

    async updateUser(root, userData, context) {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }
      if (userData.email) {
        const user = await models.userModel.findOne({
          where: { email: userData.email },
        });
        if (user) {
          throw SevenBoom.conflict('This email already exist');
        }
        await mailHelper.sendMail(userData.email, 'Update email');
      }
      await models.userModel.update(userData, {
        where: { id: context.user.id },
      });
      return {
        message: 'User information successfully updated',
      };
    },

    async connectWithUs(root, { title, description, file }, context) {
      if (!context.user) {
        throw SevenBoom.unauthorized('Access token not found');
      }
      let pathToFile = null;
      if (file) {
        pathToFile = await fileUpload(file, 'support');
      }

      await models.supportModel.create({
        title,
        description,
        file: pathToFile,
        user_id: context.user.id,
      });
      await mailHelper.sendMail(process.env.ADMIN_EMAIL, 'Support');
      return {
        message: 'User information successfully updated',
      };
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
      await pubSub.publish('NEW_MESSAGE', { newMessage: chatData });
      return { message: 'Message successfully sent' };
    },

    async readMessage(root, chatData, context) {
      await pubSub.publish('READ_MESSAGE', { readMessage: chatData });
      await models.chatModel.update(
        {
          is_read: true,
        },
        {
          where: { id: chatData.message_id, to_user: context.user.id },
        },
      );
      return { message: 'Message is already has been read' };
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('NEW_MESSAGE'),
        (payload, args) => {
          return payload.newMessage.chat_id === args.chat_id;
        },
      ),
    },
    readMessage: {
      subscribe: withFilter(
        () => pubSub.asyncIterator('READ_MESSAGE'),
        (payload, args) => {
          console.log(payload, '11111');
          console.log(args, '222222');
          return payload.readMessage.chat_id === args.chat_id;
        },
      ),
    },
  },
};

module.exports = resolvers;
