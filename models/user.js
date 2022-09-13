module.exports = (sequelize, type) => {
  return sequelize.define(
    'users',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: type.STRING,
        allowNull: false,
      },
      last_name: {
        type: type.STRING,
        allowNull: false,
      },
      email: {
        type: type.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: type.STRING,
        allowNull: false,
      },
      reset_password_token: {
        type: type.TEXT,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    },
  );
};
