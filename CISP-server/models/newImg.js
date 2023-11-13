const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

class NewImg extends Model {}

NewImg.init(
  {
    newImgId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    freezeTableName: true, //表名与模型名相同
    indexes: [
      {
        fields: ["nId", "imgUrl"],
      },
      {
        unique: true,
        fields: ["newImgId"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = NewImg;
