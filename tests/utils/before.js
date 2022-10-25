const bcrypt = require('bcryptjs');
const models = require('../../models');
const JWT = require('jsonwebtoken');

const getUserAndToken = async () => {
  let user = await models.userModel.findOne({
    where: {
      email: 'test@gmail.com',
    },
  });
  if (!user) {
    user = await models.userModel.create({
      first_name: 'admin',
      last_name: 'testAdmin',
      email: 'test@gmail.com',
      password: await bcrypt.hash('test', 10),
    });
  }
  return {
    user,
    token: await JWT.sign(
      {
        sub: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    ),
  };
};

module.exports = { getUserAndToken };
