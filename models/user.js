const Sequelize = require('sequelize');

class users extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        reset_password_token: {
          type: DataTypes.TEXT,
          defaultValue: null,
        },
      },
      {
        timestamps: false,
        freezeTableName: true,
        sequelize,
      },
    );
  }
}

module.exports = {
  users,
};
