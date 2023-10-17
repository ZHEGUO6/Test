const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

class Messages extends Model {}

Messages.init(
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
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [10, 255],
      },
    },
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
        fields: ["title", "content", "aId"],
      },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true,
  }
);

module.exports = Messages;
