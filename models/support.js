module.exports = (sequelize, type) => {
    return sequelize.define(
        'support',
        {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: type.STRING,
                allowNull: false,
            },
            description: {
                type: type.STRING,
                allowNull: false,
            },
            file: {
                type: type.STRING,
                defaultValue: null,
            },
            user_id: {
                type: type.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        },
    );
};
