const express = require('express');
const Searches = require('../models/searches');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加寻人寻物
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['title', 'intro', 'uId'], ['commentNumber', 'scanNumber']);
}

// 验证修改
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['title', 'intro', 'commentNumber', 'scanNumber']);
}

// 获取所有寻人寻物
Router.get('/', async function (req, res) {
    const { count, rows } = await Searches.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 分页获取寻人寻物
Router.get('/list', async function (req, res) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await Searches.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 根据类型获取所有寻人寻物
Router.get('/type/:typeId', async function (req, res) {
    const { typeId } = req.params;
    const { rows, count } = await Searches.findAndCountAll({
        where: {
            typeId
        }
    });
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 根据类型分页获取寻人寻物
Router.get('/list/type/:typeId', async function (req, res) {
    let { page, limit } = req.query;
    const { typeId } = req.params;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await Searches.findAndCountAll({
        limit,
        offset: (+page - 1) * limit,
        where: {
            typeId
        }
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个寻人寻物
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await Searches.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个寻人寻物
Router.post('/add', async function (req, res) {
    const SearchesInstance = await commonVaildate(req, res, Searches, vaildateAdd, 'create');
    SearchesInstance && res.send(baseSend(200, '', { datas: SearchesInstance }));
});

// 新增多个寻人寻物 (暂时不添加该功能)
Router.post('/addList', async function (req, res) {
    const SearchesInstances = await commonVaildate(req, res, Searches, vaildateAdd, 'bulkCreate');
    SearchesInstances && res.send(baseSend(200, '', { datas: SearchesInstances, count: SearchesInstances.length }));
});

// 修改单个寻人寻物信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, Searches, vaildateModify, 'update', null, {
        where: {
            searchId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个寻人寻物
Router.delete('/:id', async function (req, res) {
    const { id } = req.params;
    const deleteRows = await Searches.destroy({
        where: {
            searchId: id,
        }
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;