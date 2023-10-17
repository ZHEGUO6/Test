const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { permissionOpt, boolOpt } = require("../utils/index");
const uuidv4 = require("uuidv4");

class Admins extends Model {}
Admins.init(
  {
    loginId: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: uuidv4.uuid(),
      validate: {
        len: 36,
      },
      primaryKey: true,
    },
    loginPwd: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: {
          args: [32, 64],
          msg: "密码必须在8位到32位之间",
        },
        is: /^[0-9a-z]{32,64}$/g, //不能为纯数字或字母，必须有特殊符号并且不能有空白字符
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    nickname: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "新增管理员",
      validate: {
        len: [2, 10],
      },
    },
    enabled: boolOpt(),
    permission: permissionOpt(),
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["loginPwd", "nickname", "enabled", "permission"],
      },
      {
        unique: true,
        fields: ["loginId"],
      },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true,
  }
);

module.exports = Admins;
