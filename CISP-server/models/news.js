const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class News extends Model { }
News.init({
    newId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [2, 20]
        },
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [10, 255]
        }
    },
    scanNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        }
    },
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            unique: true,
            fields: ['aId'],
        },
        {
            fields: ['title', 'content', 'newId']
        }
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = News;