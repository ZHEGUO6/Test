const express = require('express');
const Friends = require('../models/friends');
const { baseSend, commonVaildate, catchError } = require('../utils/server');
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

// 获取某一用户的所有朋友
Router.get('/:uId', async function (req, res, next) {
    const { uId } = req.params;
    const userInstances = await sequelize.query("SELECT USERS.* FROM FRIENDS INNER JOIN USERS ON Friends.fid = USERS.loginid WHERE UID = $1 AND FRIENDS.deletedAt IS NULL AND USERS.deletedAt IS NULL", {
        bind: [uId],
        type: QueryTypes.SELECT
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (userInstances == null) {
        next('传递的id有误，请检查');
        return;
    }
    userInstances && res.send(baseSend(200, '', { datas: userInstances, count: userInstances.length }));
});

// 获取某一用户某一分组的所有朋友
Router.get('/:uId/:gId', async function (req, res, next) {
    const { uId, gId } = req.params;
    const fdInstances = await sequelize.query("SELECT USERS.* FROM FRIENDS INNER JOIN USERS ON Friends.fid = USERS.loginid WHERE UID = $1 AND GID = $2 AND FRIENDS.deletedAt IS NULL AND USERS.deletedAt IS NULL", {
        bind: [uId, gId],
        type: QueryTypes.SELECT
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (fdInstances == null) {
        next('传递的id有误，请检查');
        return;
    }
    fdInstances && res.send(baseSend(200, '', { datas: fdInstances, count: fdInstances.length }));
});

// 新增一个朋友
Router.post('/add', async function (req, res, next) {
    const FriendsInstance = await commonVaildate(req, next, Friends, vaildateAdd, 'create', async ({ uId, fId }) => {
        const has = await Friends.findOne({
            where: {
                uId,
                fId
            }
        })
        if (has) {
            return catchError(next, `该朋友已经存在，请勿多次添加`)();
        }
        return true;
    });
    if (FriendsInstance == null) {
        next('传递的id有误，请检查');
        return;
    }
    FriendsInstance && res.send(baseSend(200, '', { datas: FriendsInstance }));
});

// 新增多个朋友
Router.post('/addList', async function (req, res, next) {
    const set = new Set();
    const FriendsInstances = await commonVaildate(req, next, Friends, vaildateAdd, 'bulkCreate', async ({ uId, fId }) => {
        if (set.has(fId)) {
            return catchError(next, `传递了相同的用户id`)();
        }
        set.add(fId);
        const has = await Friends.findOne({
            where: {
                uId,
                fId
            }
        })
        if (has) {
            return catchError(next, `该朋友已经存在，请勿多次添加`)();
        }
        return true;
    });
    if (FriendsInstances == null) {
        next('传递的id有误，请检查');
        return;
    }
    FriendsInstances && res.send(baseSend(200, '', { datas: FriendsInstances, count: FriendsInstances.length }));
})

// 修改朋友信息
Router.put('/:fId', async function (req, res, next) {
    const { fId } = req.params;
    const result = await commonVaildate(req, next, Friends, vaildateModify, 'update', null, {
        where: {
            friendId: fId
        },
        returning: true
    });
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个朋友
Router.delete('/:fId', async function (req, res, next) {
    const { fId } = req.params;
    const deleteRows = await Friends.destroy({
        where: {
            friendId: fId
        },
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (deleteRows == null) {
        next('传递的id有误，请检查');
        return;
    }
    deleteRows && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;