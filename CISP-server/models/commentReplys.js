const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { boolOpt } = require("../utils");

class CommentReplys extends Model {}
CommentReplys.init(
  {
    CommentReplyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    status: boolOpt(),
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        unique: true,
        fields: ["CommentReplyId"],
      },
      {
        fields: ["cId", "uId", "status"],
      },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true,
  }
);

module.exports = CommentReplys;
