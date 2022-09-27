const _UserModel = require('../models/user');
const _SupportModel = require('../models/support');
const { DataTypes } = require('sequelize');

function initModels(sequelize) {
    const userModel = _UserModel(sequelize, DataTypes);
    const supportModel = _SupportModel(sequelize, DataTypes);
    supportModel.belongsTo(userModel, { foreignKey: 'user_id' });
    return { userModel, supportModel };
}

module.exports = initModels;
