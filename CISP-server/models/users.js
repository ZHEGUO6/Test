import Searches from "./searches";
import Groups from "./groups";
import Comments from "./comments";
import Friends from "./friends";
import UnAbled from "./unabled";
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
const { getAgeByBirthDay, validators: { password, qq, wechat, addr, phone } } = require("../utils/index");
class Users extends Model { }
Users.init({
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
            isUUID: true
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
    mail: {
        type: DataTypes.STRING(32),
        validate: {
            isEmail: true
        }
    },
    qq: {
        type: DataTypes.STRING(11),
        validate: {
            is: qq(),
            len: 11
        }
    },
    wechat: {
        type: DataTypes.STRING(20),
        validate: {
            is: wechat(),
            len: [6, 20]
        }
    },
    intro: {
        type: DataTypes.STRING(255),
        validate: {
            isNull: true,
            len: [0, 255]
        }
    },
    registerDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
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
    type: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: 'student',
        validate: {
            len: 7,
            isIn: [['student', 'teacher']]
        }
    },
    addr: {
        type: DataTypes.STRING('30'),
        allowNull: false,
        validate: {
            len: [10, 30],
            is: addr()
        }
    },
    phone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
            is: phone()
        }
    },
    online: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: 'online',
        validate: {
            isIn: [['online', 'outline', 'online-2g', 'online-3g', 'online-4g', 'online-5g']]
        }
    },
    birthDay: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    age: {
        type: DataTypes.VIRTUAL,//虚拟字段
        get() {
            return getAgeByBirthDay(this.getDataValue('birthDay'));
        },
        set() {
            throw new Error('Do not try to set the `age` value!');
        }
    }
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            unique: true,
            fields: ['_id', 'loginId'],
        },
        {
            fields: ['online', 'phone']
        }
    ],
    hooks: {
        // 注册用户之后的回调
        async afterCreate(users, options) {
            // 创建一个好友分组
            await Groups.create({
                uid: users.getDataValue('loginId'),
                name: '我的好友'
            })
        },
        // 删除用户之后的回调
        async afterDestroy(users, options) {
            // 1. 寻人交友表删除对应的信息
            // 2. 删除之前的禁用信息
            // 3. 删除分组表中的对应信息
            // 4. 朋友表中删除对应的信息
            // 5. 评论表中删除对应的信息
            const userId = users.getDataValue('loginId');
            const opt = {
                where: {
                    uid: userId
                }
            }
            await Searches.destroy(opt);
            await UnAbled.destroy(opt);
            await Groups.destroy(opt);
            await Friends.destroy(opt);
            await Comments.destroy(opt);
        }
    }
})

export default Users