const express = require('express');
const Admins = require('../models/admins');
const baseSend = require('../utils/baseSend');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });
const { encrypt, meetEncrypt } = require('../utils/encryptOrDecrypt');

// 获取所有管理员
Router.get('/', async function (req, res) {
    const { count, rows } = await Admins.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 分页获取管理员
Router.get('/list', async function (req, res) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const query = await Admins.findAll({
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: query }));
});

// 获取单个管理员
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await Admins.findByPk(id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个管理员
Router.post('/add', async function (req, res) {

});

// 新增多个管理员
Router.post('/addList', async function (req, res) { })

// 修改管理员信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    if (typeof id !== 'string' || id.length !== 36) {
        res.send(baseSend(417, '管理员帐号id格式不对'));
        return
    }
    const params = getMeetItemFromObj(req.body, ['loginPwd', 'avatar', 'nickname', 'enabled', 'permission']);
    params['loginPwd'] && (params['loginPwd'] = encrypt(meetEncrypt(params['loginPwd'])));
    await Admins.update(params, {
        where: {
            loginId: id
        }
    }).catch(err => {
        res.send(baseSend(417, `传递的信息内容与数据格式不一致，${err.message}`, null));
    })
})
module.exports = Router;