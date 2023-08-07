const Searches = require('./searches');
const Groups = require('./groups');
const Comments = require('./comments');
const Friends = require('./friends');
const UnAbled = require('./unabled');
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
const { getAgeByBirthDay, validators: { qq, wechat, addr, phone } } = require("../utils");
class Users extends Model { }
Users.init({
    loginId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
            len: 36
        },
        primaryKey: true
    },
    loginPwd: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
            len: {
                args: [32, 64],
                msg: '密码必须在8位到32位之间'
            },
            is: /^[0-9a-z]{32,64}$/g,//不能为纯数字或字母，必须有特殊符号并且不能有空白字符
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
            len: [0, 255]
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
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            min: 0,
            max: 1,
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
            fields: ['online', 'phone']
        },
        {
            unique: true,
            fields: ['loginId']
        }
    ],
    hooks: {
        // 注册用户之后的回调
        async afterCreate(users, options) {
            // 创建一个好友分组
            await Groups.create({
                uId: users.getDataValue('loginId'),
                name: '我的好友'
            })
        },
        // 删除用户之前的回调
        async beforeBulkDestroy({ where: { loginId, ...obj } }) {
            const opt = {
                where: obj
            };
            if (loginId && loginId.length === 36) {
                opt.where.uId = loginId;
            }
            else {
                // 禁止删除
                return Promise.reject(new Error('you must provide loginId to destory'));
            }
            // 1. 寻人交友表删除对应的信息
            // 2. 删除之前的禁用信息
            // 3. 删除分组表中的对应信息
            // 4. 朋友表中删除对应的信息
            // 5. 评论表中删除对应的信息
            await Searches.destroy(opt);
            await UnAbled.destroy(opt);
            await Groups.destroy(opt);
            await Friends.destroy(opt);
            await Comments.destroy(opt);
        },
    },
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = Users;