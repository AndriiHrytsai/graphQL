const models = require('../models');
const mailHelper = require('../helpers/mail.helper');
const tokenHelper = require('../helpers/token.helper');
const generator = require('generate-password');
const bcrypt = require('bcryptjs');
const { SevenBoom } = require('graphql-apollo-errors');

const getUserAndGenerateAccessToken = async (candidate) => {
  const getUser = await models.userModel.findOne({
    where: { email: candidate.email },
  });
  if (getUser) {
    return tokenHelper.user.accessToken(getUser.id, getUser.email);
  }
  if (!candidate.email) {
    throw SevenBoom.conflict('You have not specified your email');
  }

  const userPassword = generator.generate({ length: 8, numbers: true });

  const user = await models.userModel.create({
    ...candidate,
    password: await bcrypt.hash(userPassword, 10),
  });

  await mailHelper.sendMail(candidate.email, 'Your generated password', {
    userName: candidate.first_name,
    password: userPassword,
  });
  return tokenHelper.user.accessToken(user.id, user.email);
};

module.exports = getUserAndGenerateAccessToken;
