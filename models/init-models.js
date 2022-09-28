const { users } = require('../models/user');
const { support } = require('../models/support');
const { DataTypes } = require('sequelize');

function initModels(sequelize) {
    const userModel = users.init(sequelize, DataTypes);
    const supportModel = support.init(sequelize, DataTypes);
    return { userModel, supportModel };
}

module.exports = initModels;
