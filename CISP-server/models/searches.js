import Users from "./users";
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class Searches extends Model { }
Searches.init({
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isDecimal: true
        }
    },
    title: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [4, 20]
        },
    },
    intro: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [20, 255]
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
    imgUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [10, 100],
            isUrl: true
        }
    },
    commentNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    scanNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    typeId: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 1,
            isInt: true
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
            fields: ['uid', 'scanNumber', 'createdAt', 'commentNumber']
        },
    ],
    createdAt: true,
    deletedAt: true
})

export default Searches