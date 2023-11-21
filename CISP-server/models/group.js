const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { boolOpt } = require("../utils");

class Group extends Model {}

Group.init(
  {
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
        len: [2, 10],
      },
    },
    initial: boolOpt(false), // 是否是初始分组，初始分组不可删除
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["name", "uId", "initial"],
      },
      {
        unique: true,
        fields: ["groupId"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = Group;
