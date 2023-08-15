const { getMakeTime } = require("../utils/index");
const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
const Groups = require("../models/groups");
const Users = require("./users");
// 重置分组id（仅在默认添加到我的好友分组调用，请勿再其他时候调用）
async function resetGroupId(instance) {
    const gId = instance.getDataValue('gId');
    const uId = instance.getDataValue('uId');
    if (gId === 1) {
        // 判断是否仅存在一个分组
        const onlyOne = await Groups.count();
        if (onlyOne !== 1) {
            // 需要定义到默认分组
            // 找到groupId最小的分组，即为我的好友分组
            const myFriendGroupInstance = await Groups.findOne({
                where: {
                    uId
                }
            });
            instance.setDataValue('gId', myFriendGroupInstance.getDataValue('gId'));
        }

    }
}
class Friends extends Model { }
Friends.init({
    friendId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 10]
        }
    },
    makeDate: {
        type: DataTypes.VIRTUAL,//虚拟字段
        get() {
            return getMakeTime(this.getDataValue('createdAt'));
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
            fields: ['gId', 'uId', 'fId'],
        },
        {
            unique: true,
            fields: ['friendId']
        }
    ],
    hooks: {
        async afterCreate(instance) {
            //1. 如果是默认分组需要重置为我的好友分组
            //2. 反向定义朋友，并自动划分到我的好友分组，即我的朋友，他的朋友是我
            await resetGroupId(instance);
            const uId = instance.getDataValue('uId');
            const fId = instance.getDataValue('fId');
            const uInstance = await Users.findByPk(fId);
            await Friends.create({
                uId: fId,
                fId: uId,
                gId: 1,
                note: uInstance.getDataValue('nickname')
            })
        },
        async afterBulkCreate(instances) {
            await Promise.all(instances.map(async i => {
                //1. 如果是默认分组需要重置为我的好友分组
                await resetGroupId(i);
                //2. 反向定义朋友，并自动划分到我的好友分组，即我的朋友，他的朋友是我
                const uId = i.getDataValue('uId');
                const fId = i.getDataValue('fId');
                const uInstance = await Users.findByPk(fId);
                await Friends.create({
                    uId: fId,
                    fId: uId,
                    gId: 1,
                    note: uInstance.getDataValue('nickname')
                })
            }))
        },
    },
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = Friends;