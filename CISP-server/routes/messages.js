const express = require('express');
const Messages = require('../models/messages');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加消息
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['title', 'content', 'aId'], ['scanNumber']);
}

// 验证修改消息
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['title', 'content', 'scanNumber']);
}

// 获取所有消息
Router.get('/', async function (req, res) {
    const { count, rows } = await Messages.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 分页获取消息
Router.get('/list', async function (req, res) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await Messages.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个消息
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await Messages.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个消息
Router.post('/add', async function (req, res) {
    const MessagesInstance = await commonVaildate(req, res, Messages, vaildateAdd, 'create');
    MessagesInstance && res.send(baseSend(200, '', { datas: MessagesInstance }));
});

// 新增多个消息
Router.post('/addList', async function (req, res) {
    const MessagesInstances = await commonVaildate(req, res, Messages, vaildateAdd, 'bulkCreate');
    MessagesInstances && res.send(baseSend(200, '', { datas: MessagesInstances, count: MessagesInstances.length }));
});

// 修改单个消息信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, Messages, vaildateModify, 'update', null, {
        where: {
            messageId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个消息
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await Messages.destroy({
        where: {
            messageId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;