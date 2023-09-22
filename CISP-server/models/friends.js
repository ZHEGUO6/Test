const { getMakeTime } = require("../utils/index");
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

class Friends extends Model {}
Friends.init(
  {
    friendId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 10],
      },
    },
    makeDate: {
      type: DataTypes.VIRTUAL, //虚拟字段
      get() {
        return getMakeTime(this.getDataValue("createdAt"));
      },
      set(value) {
        throw new Error("Do not try to set the `makeDate` value!");
      },
    },
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["gId", "uId", "fId"],
      },
      {
        unique: true,
        fields: ["friendId"],
      },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true,
  }
);

module.exports = Friends;
