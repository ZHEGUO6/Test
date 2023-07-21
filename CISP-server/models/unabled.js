import Users from "./users";
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class UnAbled extends Model { }
UnAbled.init({
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
    unAccessMsg: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '用户操作违规',
        validate: {
            len: [2, 50]
        }
    },
    unAccessTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    }
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            unique: true,
            fields: ['_id', 'uid'],
        },
        {
            fields: ['unAccessTime']
        }
    ],
    createdAt: true
})

export default UnAbled