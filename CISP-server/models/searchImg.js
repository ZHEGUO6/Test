const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

class SearchImg extends Model {}

SearchImg.init(
  {
    searchImgId: {
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
        fields: ["sId", "imgUrl"],
      },
      {
        unique: true,
        fields: ["searchImgId"],
      },
    ],
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

module.exports = SearchImg;
