const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  database: "cisp",
  username: "root",
  password: "root",
  dialect: "mysql",
  ssl: true,
});

module.exports = sequelize;
