const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { boolOpt } = require("../utils");

class Unable extends Model {}

Unable.init(
  {
    unabledId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    unAccessMsg: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "用户操作违规",
      validate: {
        len: [2, 50],
      },
    },
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        unique: true,
        fields: ["unabledId"],
      },
      {
        fields: ["createdAt", "uId"],
      },
    ],
    timestamps: true,
    createdAt: true,
    paranoid: true,
  }
);

module.exports = Unable;
