import Users from "./users";
import Searches from "./searches";
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class Comments extends Model { }
Comments.init({
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isDecimal: true
        },
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
    searchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Searches,
            key: '_id',
        }
    },
    toUid: {
        type: DataTypes.UUIDV4,
        allowNull: true,
        validate: {
            isUUID: true
        },
        references: {
            model: Users,
            key: 'loginId',
        }
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [10, 255]
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
            fields: ['uid', 'searchId']
        },
    ],
    createdAt: true,
    deletedAt: true
})

export default Comments