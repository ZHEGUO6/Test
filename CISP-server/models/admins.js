const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
const { permissionOpt } = require("../utils/index");
const Messages = require('./messages');
const News = require('./news');
class Admins extends Model { }
Admins.init({
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
    enabled: permissionOpt,
    permission: permissionOpt
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            fields: ['loginId', 'loginPwd', 'nickname']
        }
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true,
    hooks: {
        async beforeBulkDestroy({ where: { loginId, ...obj } }) {
            const opt = {
                where: obj
            };
            if (loginId && loginId.length === 36) {
                opt.where.aId = loginId;
            }
            else {
                // 禁止删除
                return Promise.reject(new Error('you must provide loginId to destory'));
            }
            // 删除相关消息
            Messages.destroy(opt);
            // 删除相关新闻
            News.destroy(opt);
        }
    }
})

module.exports = Admins;