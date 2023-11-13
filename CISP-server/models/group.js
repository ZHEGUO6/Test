const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

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
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["name", "uId"],
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
