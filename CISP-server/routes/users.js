const express = require('express');
const Users = require('../models/users');
const { baseSend, commonVaildate, catchError } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });
const { encrypt, meetEncrypt } = require('../utils/encryptOrDecrypt');
const { getRandom } = require('../utils/math');
const fs = require('fs');

// 验证添加用户
async function vaildateAdd(userInfo) {
    return await getMeetItemFromObj(userInfo, ['loginId', ['loginPwd', (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd)))]], ['nickname', 'enabled', 'type', ['avatar', async (avatar) => {
        if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(path.resolve(__dirname, '../public/images'));
            return `http://localhost:${process.env.PORT || 3000}/public/images/${images[getRandom(1, images.length - 1)]}`
        }
        return avatar
    }], 'mail', 'qq', 'wechat', 'intro', 'lastLoginDate', 'addr', 'phone', 'online', 'birthDay']);
}

// 验证修改
async function vaildateModify(userInfo) {
    return await getMeetItemFromObj(userInfo, [], [['loginPwd', (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd)))], 'nickname', 'enabled', 'type', ['avatar', async (avatar) => {
        if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(path.resolve(__dirname, '../public/images'));
            return `http://localhost:${process.env.PORT || 3000}/public/images/${images[getRandom(1, images.length - 1)]}`
        }
    }], 'mail', 'qq', 'wechat', 'intro', 'lastLoginDate', 'addr', 'phone', 'online', 'birthDay']);
}

// 获取所有用户
Router.get('/', async function (req, res) {
    const { count, rows } = await Users.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 分页获取用户
Router.get('/list', async function (req, res, next) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        return catchError(next, '请求的参数数据类型或值不满足要求')();
    }
    const result = await Users.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    result && res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个用户
Router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    const query = await Users.findByPk(id).catch(catchError(next, '传递的数据类型有误，请检查'));
    query && res.send(baseSend(200, '', { datas: query }));
});

// 新增一个用户
Router.post('/add', async function (req, res, next) {
    const userInstance = await commonVaildate(req, next, Users, vaildateAdd, 'create');
    userInstance && res.send(baseSend(200, '', { datas: userInstance }));
});

// 新增多个用户
Router.post('/addList', async function (req, res, next) {
    const userInstances = await commonVaildate(req, next, Users, vaildateAdd, 'bulkCreate');
    userInstances && res.send(baseSend(200, '', { datas: userInstances, count: userInstances.length }));
})

// 修改用户信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonVaildate(req, next, Users, vaildateModify, 'update', null, {
        where: {
            loginId: id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个用户
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await Users.destroy({
        where: {
            loginId: id
        },
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;