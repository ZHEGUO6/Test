const express = require('express');
const sequelize = require('./sequelize');
// sequelize.sync()//同步模型
const app = express();
module.exports = app