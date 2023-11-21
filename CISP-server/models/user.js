const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const {
  getAgeByBirthDay,
  validators: { qq, wechat, addr, phone, url },
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
        is: url(),
      },
    },
    nickname: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "新增用户",
      validate: {
        len: [2, 10],
      },
    },
    mail: {
      type: DataTypes.STRING(32),
      allowNull: true,
      validate: {
        is: /^([A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+|\s)$/,
      },
    },
    qq: {
      type: DataTypes.STRING(11),
      allowNull: true,
      validate: {
        is: qq(),
      },
    },
    wechat: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: wechat(),
      },
    },
    intro: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
      allowNull: true,
      validate: {
        is: addr(),
      },
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      validate: {
        is: phone(),
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
      allowNull: true,
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
        fields: ["online", "qq", "wechat", "loginPwd", "nickname"],
      },
      {
        unique: true,
        fields: ["loginId", "phone"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = User;
