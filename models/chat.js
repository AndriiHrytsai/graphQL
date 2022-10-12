const Sequelize = require('sequelize');

class chat extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        chat_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        message: {
          type: DataTypes.STRING,
        },
        from_user: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        to_user: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        timestamps: true,
        freezeTableName: true,
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.userModel, { foreignKey: 'from_user' });
    this.belongsTo(models.userModel, { foreignKey: 'to_user' });
  }
}

module.exports = {
  chat,
};
