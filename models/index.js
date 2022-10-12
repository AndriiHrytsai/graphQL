const Sequelize = require('sequelize');
const initModels = require('./init-models.js');

const config = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  logging: false,
  ssl: true,
};
const models = {};
let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    config,
  );

  const dbModels = initModels(sequelize);

  Object.entries(dbModels).forEach(([modelName, model]) => {
    models[modelName] = model;
  });

  Object.values(models)
    .filter((model) => typeof model.associate === 'function')
    .forEach((model) => model.associate(models));

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;
} catch (e) {
  console.error('Unable to connect to the database:', e);
}

module.exports = models;
