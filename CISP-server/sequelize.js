const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  database: "cisp",
  username: "root",
  password: "TrustmeChenxi.1314",
  dialect: "mysql",
  ssl: true,
  dialectOptions: {
    charset: "utf8",
    collate: "utf8mb4_0900_ai_ci",
  },
});

module.exports = sequelize;
