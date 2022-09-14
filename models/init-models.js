const _UserModel = require('../models/user');
const { DataTypes } = require('sequelize');

function initModels(sequelize) {
  const userModel = _UserModel(sequelize, DataTypes);
  return { userModel };
}

module.exports = initModels;
