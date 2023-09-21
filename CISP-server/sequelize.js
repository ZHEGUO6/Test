const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    database: 'CISP',
    username: 'root',
    password: 'TrustmeChenxi.1314',
    dialect: 'mysql',
    ssl: true,
})

module.exports = sequelize