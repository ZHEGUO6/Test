const { Model, DataTypes, ValidationError } = require("sequelize");
const sequelize = require("../sequelize");
const {
  getAgeByBirthDay,
  validators: { qq, wechat, addr, phone, url, validateTest },
  boolOpt,
} = require("../utils");
const uuidv4 = require("uuidv4");

class User extends Model {}

User.init(
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
        isTest: validateTest(url(), "string", "avatar"),
      },
    },
    nickname: {
      type: DataTypes.STRING(10) + "COLLATE utf8mb4_0900_as_cs", // 单列设置排序格式
      allowNull: false,
      defaultValue: "新增用户",
      validate: {
        len: [2, 10],
      },
    },
    mail: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        isTest: validateTest(
          /^([A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+|''|"")$/,
          "string",
          "mail"
        ),
      },
    },
    qq: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        isTest: validateTest(qq(), "string", "qq"),
      },
    },
    wechat: {
      type: DataTypes.STRING(20) + "COLLATE utf8mb4_0900_as_cs",
      allowNull: false,
      validate: {
        isTest: validateTest(wechat(), "string", "wechat"),
      },
    },
    intro: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [0, 255],
      },
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
      validate: {
        isDate: true,
      },
    },
    enabled: boolOpt(),
    type: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: "student",
      validate: {
        len: 7,
        isIn: [["student", "teacher"]],
      },
    },
    addr: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isTest: validateTest(addr(), "string", "addr"),
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        isTest: validateTest(phone(), "string", "phone"),
      },
    },
    online: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "online",
      validate: {
        isIn: [
          [
            "online",
            "outline",
            "online-2g",
            "online-3g",
            "online-4g",
            "online-5g",
          ],
        ],
      },
    },
    birthDay: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    age: {
      type: DataTypes.VIRTUAL, //虚拟字段
      get() {
        return getAgeByBirthDay(this.getDataValue("birthDay"));
      },
      set() {
        throw new Error("Do not try to set the `age` value!");
      },
    },
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["online", "loginPwd"],
      },
      {
        unique: true,
        fields: ["loginId", "phone", "nickname", "qq", "wechat"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User;
