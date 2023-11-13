const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { boolOpt } = require("../utils");

class Comment extends Model {}
Comment.init(
  {
    commentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    status: boolOpt(), // 是否审核通过
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["uId", "sId"],
      },
      {
        unique: true,
        fields: ["commentId", "status"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Comment;
