const express = require('express');
const Friends = require('../models/friends');
const Users = require('../models/users');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const sequelize = require('../sequelize');
const { QueryTypes } = require('sequelize');
const Router = express.Router({ caseSensitivea: true });

// 验证添加朋友
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['uId', 'fId', 'gId', 'note']);
}

async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['note']);
}

// // 分页获取朋友(应该没有这个需求)
// Router.get('/list', async function (req, res) {
//     let { page, limit } = req.query;
//     limit = +limit;
//     if (page < 0 || !limit && limit < 0) {
//         // 请求未满足期望值
//         res.send(baseSend(417, ''));
//         return
//     }
//     const { rows, count } = await Friends.findAndCountAll({
//         limit,
//         offset: (+page - 1) * limit
//     })
//     res.send(baseSend(200, '', { datas: rows, count }));
// });

// 获取某一用户的所有朋友
Router.get('/:uId', async function (req, res) {
    const { uId } = req.params;
    const fdInstances = await Friends.findAll({
        where: {
            uId
        },
    })
    const userInstances = await Promise.all(fdInstances.map(async i => await Users.findByPk(i.getDataValue('fId'))));
    res.send(baseSend(200, '', { datas: userInstances, count: userInstances.length }));
});

// 获取某一用户某一分组的所有朋友
Router.get('/:uId/:gId', async function (req, res) {
    const { uId, gId } = req.params;
    const fdInstances = await sequelize.query("SELECT USERS.* FROM FRIENDS INNER JOIN USERS ON Friends.fid = USERS.loginid WHERE UID = $1 AND GID = $2 AND FRIENDS.deletedAt IS NULL AND USERS.deletedAt IS NULL", {
        bind: [uId, gId],
        type: QueryTypes.SELECT
    })
    res.send(baseSend(200, '', { datas: fdInstances, count: fdInstances.length }));
});

// 新增一个朋友
Router.post('/add', async function (req, res) {
    const FriendsInstance = await commonVaildate(req, res, Friends, vaildateAdd, 'create', async ({ uId, fId }) => {
        if (set.has(fId)) {
            res.send(baseSend(417, `传递了相同的用户id`));
            return false;
        }
        set.add(fId);
        const has = await Friends.findOne({
            where: {
                uId,
                fId
            }
        })
        if (has) {
            res.send(baseSend(417, `该朋友已经存在，请勿多次添加`));
            return false;
        }
        return true;
    });
    FriendsInstance && res.send(baseSend(200, '', { datas: FriendsInstance }));
});

// 新增多个朋友
Router.post('/addList', async function (req, res) {
    const set = new Set();
    const FriendsInstances = await commonVaildate(req, res, Friends, vaildateAdd, 'bulkCreate', async ({ uId, fId }) => {
        if (set.has(fId)) {
            res.send(baseSend(417, `传递了相同的用户id`));
            return false;
        }
        set.add(fId);
        const has = await Friends.findOne({
            where: {
                uId,
                fId
            }
        })
        if (has) {
            res.send(baseSend(417, `该朋友已经存在，请勿多次添加`));
            return false;
        }
        return true;
    });
    FriendsInstances && res.send(baseSend(200, '', { datas: FriendsInstances, count: FriendsInstances.length }));
})

// 修改朋友信息
Router.put('/:fId', async function (req, res) {
    const { fId } = req.params;
    const result = await commonVaildate(req, res, Friends, vaildateModify, 'update', null, {
        where: {
            friendId: fId
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个朋友
Router.delete('/:fId', async function (req, res) {
    const { fId } = req.params;
    const deleteRows = await Friends.destroy({
        where: {
            friendId: fId
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;