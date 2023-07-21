const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    database: 'CISP',
    username: 'sa',
    password: 'TrustmeChenxi.1314',
    dialect: 'mssql',
    ssl: true,
})

module.exports = sequelize