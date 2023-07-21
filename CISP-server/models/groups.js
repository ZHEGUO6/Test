const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class Groups extends Model { }
Groups.init({
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isDecimal: true
        }
    },
    uid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            isUUID: true
        },
        references: {
            model: Users,
            key: 'loginId',
        }
    },
    name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            len: [2, 10]
        }
    },
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            unique: true,
            fields: ['_id'],
        },
        {
            fields: ['uid']
        }
    ],
})

export default Groups