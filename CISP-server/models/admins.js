const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
const { validators: { password } } = require("../utils/index");
class Admins extends Model { }
Admins.init({
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isDecimal: true
        }
    },
    loginId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            isUUID: {
                args: 4,
                msg: 'loginId is invailde'
            }
        }
    },
    loginPwd: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
            len: {
                args: [8, 16],
                msg: 'loginPwd must between than 8 and 16 characters'
            },
            is: [password(8, 16), 'g'],//不能为纯数字或字母，必须有特殊符号并且不能有空白字符
        }
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    nickname: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            len: [2, 10]
        }
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            isIn: [[false, true]]
        }
    },
    permission: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 1,
            isDecimal: true
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
            fields: ['loginPwd', 'nickname']
        }
    ]
})

export default Admins