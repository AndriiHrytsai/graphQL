const bcrypt = require('bcryptjs');
const helper = require('../helpers/token.helper');
const { SevenBoom } = require('graphql-apollo-errors');

const resolvers = {
  Query: {
    async user(root, { id }, { models }) {
      const user = await models.userModel.findOne({
        where: { id: id },
      });
      return user;
    },
  },
  Mutation: {
    async createUser(
      root,
      { first_name, last_name, email, password },
      { models },
    ) {
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

    async login(root, { email, password }, { models }) {
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

      const access_token = helper.user.accessToken(findUser.id, findUser.email);
      return { access_token: access_token };
    },
  },
};

module.exports = resolvers;
