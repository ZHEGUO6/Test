const { getAgeByBirthDay } = require("../utils/index");
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class Friends extends Model { }
Friends.init({
    friendId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    makeDate: {
        type: DataTypes.VIRTUAL,//虚拟字段
        get() {
            return getAgeByBirthDay(this.getDataValue('createdAt'));
        },
        set(value) {
            throw new Error('Do not try to set the `makeDate` value!');
        }
    }
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            fields: ['friendId'],
        },
        {
            unique: true,
            fields: ['uId', 'fId']
        },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = Friends;