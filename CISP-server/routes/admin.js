const express = require('express');
const Admins = require('../models/admins');
const { baseSend, commonVaildate, catchError, readReqData } = require('../utils/server');
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
Router.post('/vaildate', async function (req, res, next) {
    const body = await readReqData(req).catch(err => catchError(next, err)());
    if (!body) return;
    const { nickname, loginPwd } = body;
    const result = await Admins.findOne({
        where: {
            nickname,
            loginPwd: encrypt(meetEncrypt(loginPwd))
        }
    }).catch(catchError(next, '传递的数据类型有误'));
    if (result == null) {
        next('帐号或密码不正确');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result }))
})

// 管理员登录
Router.post('/login', async function (req, res, next) {
    // 验证登录是否成功
    const body = await readReqData(req).catch(err => catchError(next, `传递的请求体有误，${err}`)());
    const { nickname, loginPwd, saveTime = 1000 * 60 } = body;
    if (!body) return;
    const adminInstance = await Admins.findOne({ where: { nickname, loginPwd: encrypt(meetEncrypt(loginPwd)) } }).catch(catchError(next, '传递的数据类型有误，登录失败'));
    if (adminInstance) {
        req.session.adminId = adminInstance.getDataValue('loginId');
        req.session.cookie.maxAge = saveTime;
        res.send(baseSend(200, '登录成功', { datas: adminInstance }));
        return;
    }
    if (adminInstance == null) {
        next(`登录失败，帐号或密码有误`);
    }
})

// 管理员恢复登录状态
Router.get('/login/whoamI', async function (req, res, next) {
    if (req.session.adminId) {
        const adminInstance = await Admins.findByPk(req.session.adminId).catch(catchError(next, `登录信息有误，请重新登录`));
        if (adminInstance == null) {
            next('登录信息已失效，请重新登录');
        }
        adminInstance && res.send(baseSend(200, '恢复登录成功', { datas: adminInstance }));
        return
    }
    next('登录信息已失效，请重新登录');
})

// 管理员退出登录
Router.post('/logout', async function (req, res, next) {
    req.session.adminId = null;
    res.send(baseSend(200, '退出登录成功'));
})

// 新增一个管理员
Router.post('/add', async function (req, res, next) {
    const adminInstance = await commonVaildate(req, next, Admins, vaildateAddAdmin, 'create');
    if (adminInstance == null) {
        next('新增管理员失败');
        return;
    }
    adminInstance && res.send(baseSend(200, '', { datas: adminInstance }));
});

// 新增多个管理员
Router.post('/addList', async function (req, res, next) {
    const adminInstances = await commonVaildate(req, next, Admins, vaildateAddAdmin, 'bulkCreate');
    if (adminInstances == null) {
        next('新增管理员失败');
        return;
    }
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
    if (result == null) {
        next('修改管理员信息失败');
        return;
    }
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
    if (deleteRows == null) {
        next('删除管理员失败');
        return;
    }
    deleteRows && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;