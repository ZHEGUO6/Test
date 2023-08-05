const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class Comments extends Model { }
Comments.init({
    commentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            fields: ['commentId', 'toUid'],
        },
        {
            unique: true,
            fields: ['uId']
        }
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = Comments;