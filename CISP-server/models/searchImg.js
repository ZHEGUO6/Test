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
    },
    // 保存图片宽高，用于前端瀑布流展示
    size:{
      type:DataTypes.JSON,
      allowNull:false
    }
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
  }
);

module.exports = SearchImg;
