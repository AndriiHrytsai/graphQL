const models = require('../../models');
const { SevenBoom } = require('graphql-apollo-errors');
const bcrypt = require('bcryptjs');
const { mailHelper, tokenHelper } = require('../../helpers');

const userResolver = {
  async user(root, { id }) {
    return await models.userModel.findByPk(id);
  },

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

    const incorrectPassword = !bcrypt.compareSync(password, findUser.password);
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
};

module.exports = userResolver;
