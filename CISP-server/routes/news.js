const express = require('express');
const News = require('../models/news');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加新闻
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['title', 'content', 'aId'], ['scanNumber']);
}

// 验证修改
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['title', 'content', 'scanNumber']);
}

// 获取所有新闻
Router.get('/', async function (req, res) {
    const { count, rows } = await News.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 分页获取新闻
Router.get('/list', async function (req, res) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await News.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个新闻
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await News.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个新闻
Router.post('/add', async function (req, res) {
    const NewsInstance = await commonVaildate(req, res, News, vaildateAdd, 'create');
    NewsInstance && res.send(baseSend(200, '', { datas: NewsInstance }));
});

// 新增多个新闻
Router.post('/addList', async function (req, res) {
    const NewsInstances = await commonVaildate(req, res, News, vaildateAdd, 'bulkCreate');
    NewsInstances && res.send(baseSend(200, '', { datas: NewsInstances, count: NewsInstances.length }));
});

// 修改单个新闻信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, News, vaildateModify, 'update', null, {
        where: {
            newId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个新闻
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await News.destroy({
        where: {
            newId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;