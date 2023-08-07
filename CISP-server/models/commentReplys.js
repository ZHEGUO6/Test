const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class CommentReplys extends Model { }
CommentReplys.init({
    CommentReplyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    },
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            fields: ['CommentReplyId'],
        },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = CommentReplys;