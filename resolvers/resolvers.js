const bcrypt = require('bcryptjs');
const { mailHelper, tokenHelper } = require('../helpers');
const { SevenBoom } = require('graphql-apollo-errors');
const models = require('../models');
const { v4: uuid } = require('uuid');

const resolvers = {
  Query: {
    async user(root, { id }) {
      const user = await models.userModel.findByPk(id);
      return user;
    },
    async currentUser(root, {}, context) {
      return context.user;
    },
    async changePassword(root, { token, password }) {
      const findUser = await models.userModel.findOne({
        where: { reset_password_token: token },
      });
      if (findUser === null) {
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
      return 'Password successfully changed';
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
        }; // або ж казати шо мейл відправленно шоб той хто хоче заволодіти сторінкою думав що він вгадав мейл
        // throw SevenBoom.conflict('This user in not defined'); або видавати помилку
      }
      const forgotPasswordHash = uuid();
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
    async deleteForgotPasswordToken(root, {}, context) {
      const email = context.req.query.email;
      await models.userModel.update(
        {
          reset_password_token: null,
        },
        {
          where: { email: email },
        },
      );

      return {
        message: 'The forgot password token was successfully deleted',
      };
    },
  },
};

module.exports = resolvers;
