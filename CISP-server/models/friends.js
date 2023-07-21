import Users from "./users";
import Groups from "./groups";
const { getAgeByBirthDay } = require("../utils/index");
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class Friends extends Model { }
Friends.init({
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
    fid: {
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
    group: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            len: [2, 10]
        },
        references: {
            model: Groups,
            key: 'name',
        }
    },
    makeDate: {
        type: DataTypes.VIRTUAL,//虚拟字段
        get() {
            return getAgeByBirthDay(this.getDataValue('createdAt'));
        },
        set(value) {
            throw new Error('Do not try to set the `makeDate` value!');
        }
    }
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            unique: true,
            fields: ['_id'],
        },
        {
            fields: ['uid', 'fid', 'createdAt']
        },
    ],
    createdAt: true,
    deletedAt: true
})

export default Friends