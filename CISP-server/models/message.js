const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { boolOpt } = require("../utils");

class Message extends Model {}

Message.init(
  {
    messageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [2, 20],
      },
    },
    remove: {
      ...boolOpt(),
      defaultValue: false,
    }, // 是否移除到回收站
    content: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      ...boolOpt(),
      defaultValue: false,
    }, // 是否已读
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        unique: true,
        fields: ["messageId"],
      },
      {
        fields: ["title", "content", "uId", "remove"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Message;
