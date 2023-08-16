const express = require('express');
const Admins = require('../models/admins');
const { baseSend, commonVaildate, catchError } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });
const { encrypt, meetEncrypt } = require('../utils/encryptOrDecrypt');
const { getRandom } = require('../utils/math');
const fs = require('fs');

// 验证添加管理员
async function vaildateAddAdmin(adminInfo) {
    return await getMeetItemFromObj(adminInfo, ['loginId', ['loginPwd', (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd)))]], ['nickname', 'enabled', 'permission', ['avatar', async (avatar) => {
        if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(path.resolve(__dirname, '../public/images'));
            return `http://localhost:${process.env.PORT || 3000}/public/images/${images[getRandom(1, images.length - 1)]}`
        }
        return avatar
    }]]);
}

// 验证修改管理员
async function vaildateModifyAdmin(adminInfo) {
    return await getMeetItemFromObj(adminInfo, [], [['loginPwd', (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd)))], ['avatar', async (avatar) => {
        if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(path.resolve(__dirname, '../public/images'));
            return `http://localhost:${process.env.PORT || 3000}/public/images/${images[getRandom(1, images.length - 1)]}`
        }
    }], 'nickname', 'enabled', 'permission']);
}

// 获取所有管理员
Router.get('/', async function (req, res) {
    const { count, rows } = await Admins.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 分页获取管理员
Router.get('/list', async function (req, res, next) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        return catchError(next, `请求参数数据类型或值不对`)();
    }
    const result = await Admins.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    result && res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个管理员
Router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    const query = await Admins.findByPk(id).catch(catchError(next, '传递的数据类型有误'));
    query && res.send(baseSend(200, '', { datas: query }));
});

// 验证帐号密码是否正确
Router.get('/vaildate', async function (req, res, next) {
    const { loginId, loginPwd } = req.query;
    const result = await Admins.findOne({
        where: {
            loginId,
            loginPwd
        }
    }).catch(catchError(next, '传递的数据类型有误'));
    result && res.send(baseSend(200, '', { datas: result }))
})

// 管理员登录
Router.post('/login', async function (req, res, next) {
    // req.session.
})

// 新增一个管理员
Router.post('/add', async function (req, res, next) {
    const adminInstance = await commonVaildate(req, next, Admins, vaildateAddAdmin, 'create');
    adminInstance && res.send(baseSend(200, '', { datas: adminInstance }));
});

// 新增多个管理员
Router.post('/addList', async function (req, res, next) {
    const adminInstances = await commonVaildate(req, next, Admins, vaildateAddAdmin, 'bulkCreate');
    adminInstances && res.send(baseSend(200, '', { datas: adminInstances, count: adminInstances.length }));
})

// 修改管理员信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonVaildate(req, next, Admins, vaildateModifyAdmin, 'update', null, {
        where: {
            loginId: id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个管理员
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await Admins.destroy({
        where: {
            loginId: id
        },
    }).catch(catchError(next, `传递的数据格式不对，请更正后再操作`));
    deleteRows && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;