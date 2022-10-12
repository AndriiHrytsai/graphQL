const { users } = require('../models/user');
const { support } = require('../models/support');
const { chat } = require('../models/chat');
const { DataTypes } = require('sequelize');

function initModels(sequelize) {
    const userModel = users.init(sequelize, DataTypes);
    const supportModel = support.init(sequelize, DataTypes);
    const chatModel = chat.init(sequelize, DataTypes);
    return { userModel, supportModel, chatModel };
}

module.exports = initModels;
