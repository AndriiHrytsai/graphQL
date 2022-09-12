const bcrypt = require('bcryptjs');
const { connectToDatabaseUser } = require('../database/connection');
const helper = require('../helpers/token.helper');
const { SevenBoom } = require('graphql-apollo-errors');


const resolvers = {
    Query: {
        async user(root, { id }) {
            const { Users } = await connectToDatabaseUser();
            const user = await Users.findOne({
                where: { id: id },
            });
            return user;
        },
        async getAllUsers() {
            const { Users } = await connectToDatabaseUser();
            const users = await Users.findAll();
            return users;
        },
    },
    Mutation: {
        async createUser(root, { first_name, last_name, email, password }) {
            const { Users } = await connectToDatabaseUser();
            const findUser = await Users.findOne({
                where: { email: email },
            });

            if (findUser) {
                throw SevenBoom.badData('This email already exist');
            }

            return Users.create({
                first_name,
                last_name,
                email,
                password: await bcrypt.hash(password, 10),
            });
        },

        async login(root, { email, password }) {
            const { Users } = await connectToDatabaseUser();

            const findUser = await Users.findOne({
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

            let user = await Users.update(
                {
                    access_token: access_token,
                },
                {
                    where: {
                        email: email,
                    },
                    returning: true,
                    raw: true,
                    nest: true,
                },
            );
            return user[1][0];
        },
    },
};

module.exports = resolvers;
