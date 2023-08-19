const express = require('express');
const UnAbled = require('../models/unabled');
const { baseSend, commonVaildate, catchError } = require('../utils/server');
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
Router.get('/list', async function (req, res, next) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        return catchError(next, '请求的参数数据类型或值不满足要求')();
    }
    const result = await UnAbled.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('查询禁用记录数据失败');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result.rows, count: result.count }));
});

// 获取单个禁用记录
Router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    const query = await UnAbled.findByPk(id).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (query == null) {
        next('传递的id有误，请检查');
        return;
    }
    query && res.send(baseSend(200, '', { datas: query }));
});

// 新增一个禁用记录
Router.post('/add', async function (req, res, next) {
    const unabledInstance = await commonVaildate(req, next, UnAbled, vaildateAdd, 'create', async item => {
        const has = await UnAbled.findOne({
            where: {
                uId: item.uId
            }
        })
        if (has) {
            return catchError(next, '该用户已经被禁用了，无法多次禁用')();
        }
        return true;
    });
    if (unabledInstance == null) {
        next('新增禁用记录失败');
        return;
    }
    unabledInstance && res.send(baseSend(200, '', { datas: unabledInstance }));
});

// 新增多个禁用记录
Router.post('/addList', async function (req, res, next) {
    const set = new Set();
    const unabledInstances = await commonVaildate(req, next, UnAbled, vaildateAdd, 'bulkCreate', async item => {
        if (set.has(item.uId)) {
            return catchError(next, `传递了相同的用户id`)();
        }
        const has = await UnAbled.findOne({
            where: {
                uId: item.uId
            }
        })
        if (has) {
            return catchError(next, '该用户已经被禁用了，无法多次禁用')();
        }
        set.add(item.uId);
        return true
    });
    if (unabledInstances == null) {
        next('新增禁用记录失败');
        return;
    }
    unabledInstances && res.send(baseSend(200, '', { datas: unabledInstances, count: unabledInstances.length }));
})

// 修改禁用记录信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonVaildate(req, next, UnAbled, vaildateModify, 'update', null, {
        where: {
            unabledId: id
        },
        returning: true
    });
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个禁用记录
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await UnAbled.destroy({
        where: {
            unabledId: id
        },
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    deleteRows && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;