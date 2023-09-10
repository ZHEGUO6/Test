const express = require('express');
const Groups = require('../models/groups');
const { baseSend, commonValidate, catchError } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitive: true });

// 验证添加分组
async function validateAdd(groupInfo) {
    return await getMeetItemFromObj(groupInfo, ['name', 'uId']);
}

// 验证修改
async function validateModify(groupInfo) {
    return await getMeetItemFromObj(groupInfo, [], ['name']);
}

// 获取所有分组
Router.get('/', async function (req, res) {
    const { count, rows } = await Groups.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 获取指定用户的所有分组
Router.get('/list/:uId', async function (req, res, next) {
    const { uId } = req.params;
    const result = await Groups.findAndCountAll({
        where: {
            uId
        }
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result.rows, count: result.count }));
})

// 获取单个分组
Router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    const query = await Groups.findByPk(+id).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (query == null) {
        next('传递的id有误，请检查');
        return;
    }
    query && res.send(baseSend(200, '', { datas: query }));
});

// 新增一个分组
Router.post('/add', async function (req, res, next) {
    const groupInstance = await commonValidate(req, next, Groups, validateAdd, 'create');
    if (groupInstance == null) {
        next('新增分组失败');
        return;
    }
    groupInstance && res.send(baseSend(200, '', { datas: groupInstance }));
});

// 新增多个分组
Router.post('/addList', async function (req, res, next) {
    const groupInstances = await commonValidate(req, next, Groups, validateAdd, 'bulkCreate');
    if (groupInstances == null) {
        next('新增分组失败');
        return;
    }
    groupInstances && res.send(baseSend(200, '', { datas: groupInstances, count: groupInstances.length }));
})

// 修改分组信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonValidate(req, next, Groups, validateModify, 'update', null, {
        where: {
            groupId: +id
        },
        returning: true
    });
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个分组
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await Groups.destroy({
        where: {
            groupId: +id
        },
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (deleteRows == null) {
        next('传递的id有误，请检查');
        return;
    }
    typeof deleteRows === 'number' && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;