const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

class UnAbled extends Model {}

UnAbled.init(
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
    createdAt: true,
    deletedAt: true,
    paranoid: true,
  }
);

module.exports = UnAbled;
