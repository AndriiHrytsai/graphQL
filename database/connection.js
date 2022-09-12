const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    logging: false,
    ssl: true,
  },
);

const UserModel = require('../models/user');
const Users = UserModel(sequelize, Sequelize);
const User = { Users };
let isConnectedToUsers = false;

const connectToDatabaseUser = async () => {
  if (isConnectedToUsers) return User;
  await sequelize.sync();
  await sequelize.authenticate();
  isConnectedToUsers = true;
  return User;
};

module.exports = {
  connectToDatabaseUser,
  sequelize,
};
