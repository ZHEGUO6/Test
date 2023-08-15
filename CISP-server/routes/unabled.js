const express = require('express');
const UnAbled = require('../models/unabled');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加禁用记录
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['unAccessMsg', 'uId']);
}

// 验证修改
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['unAccessMsg']);
}

// 获取所有禁用记录
Router.get('/', async function (req, res) {
    const { count, rows } = await UnAbled.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 分页获取禁用记录
Router.get('/list', async function (req, res) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await UnAbled.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个禁用记录
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await UnAbled.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个禁用记录
Router.post('/add', async function (req, res) {
    const unabledInstance = await commonVaildate(req, res, UnAbled, vaildateAdd, 'create', async item => {
        const has = await UnAbled.findOne({
            where: {
                uId: item.uId
            }
        })
        if (has) {
            res.send(baseSend(417, '该用户已经被禁用了，无法多次禁用'));
            return false;
        }
        return true;
    });
    unabledInstance && res.send(baseSend(200, '', { datas: unabledInstance }));
});

// 新增多个禁用记录
Router.post('/addList', async function (req, res) {
    const set = new Set();
    const unabledInstances = await commonVaildate(req, res, UnAbled, vaildateAdd, 'bulkCreate', async item => {
        if (set.has(item.uId)) {
            res.send(baseSend(417, `传递了相同的用户id`));
            return false;
        }
        const has = await UnAbled.findOne({
            where: {
                uId: item.uId
            }
        })
        if (has) {
            res.send(baseSend(417, '该用户已经被禁用了，无法多次禁用'));
            return false;
        }
        set.add(item.uId);
        return true
    });
    unabledInstances && res.send(baseSend(200, '', { datas: unabledInstances, count: unabledInstances.length }));
})

// 修改禁用记录信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, UnAbled, vaildateModify, 'update', null, {
        where: {
            unabledId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个禁用记录
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await UnAbled.destroy({
        where: {
            unabledId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;