const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');

class Groups extends Model { }

Groups.init({
    groupId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            len: [2, 10]
        }
    },
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            fields: ['name', 'uId'],
        },
        {
            unique: true,
            fields: ['groupId']
        }
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = Groups;