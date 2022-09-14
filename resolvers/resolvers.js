const bcrypt = require('bcryptjs');
const helper = require('../helpers/token.helper');
const { SevenBoom } = require('graphql-apollo-errors');
const models = require('../models');

const resolvers = {
    Query: {
        async user(root, { id }) {
            const user = await models.userModel.findByPk(id);
            return user;
        },
        async currentUser(root, {}, context) {
            return context.user;
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

            const access_token = helper.user.accessToken(findUser.id, findUser.email);
            return { access_token };
        },
    },
};

module.exports = resolvers;
