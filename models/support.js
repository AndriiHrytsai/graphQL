const Sequelize = require('sequelize');

class support extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                file: {
                    type: DataTypes.STRING,
                    defaultValue: null,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                timestamps: false,
                freezeTableName: true,
                sequelize
            },
        )
    };

    static associate(models) {
        this.belongsTo(models.userModel, { foreignKey: "user_id" });
    }
}

module.exports = {
    support
}
