const express = require('express');
const Groups = require('../models/groups');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加分组
async function vaildateAdd(groupInfo) {
    return await getMeetItemFromObj(groupInfo, ['name', 'uId']);
}

// 验证修改
async function vaildateModify(groupInfo) {
    return await getMeetItemFromObj(groupInfo, [], ['name']);
}

// 获取所有分组
Router.get('/', async function (req, res) {
    const { count, rows } = await Groups.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
})

// // 分页获取分组 (目前没有这个需求)
// Router.get('/list', async function (req, res) {
//     let { page, limit } = req.query;
//     limit = +limit;
//     if (page < 0 || !limit && limit < 0 ) {
//         // 请求未满足期望值
//         res.send(baseSend(417, ''));
//         return
//     }
//     const { rows, count } = await Groups.findAndCountAll({
//         limit,
//         offset: (+page - 1) * limit
//     })
//     res.send(baseSend(200, '', { datas: rows, count }));
// });

// 获取指定用户的所有分组
Router.get('/list/:uId', async function (req, res) {
    const { uId } = req.params;
    const { count, rows } = await Groups.findAndCountAll({
        where: {
            uId
        }
    });
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 获取单个分组
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await Groups.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个分组
Router.post('/add', async function (req, res) {
    const groupInstance = await commonVaildate(req, res, Groups, vaildateAdd, 'create');
    groupInstance && res.send(baseSend(200, '', { datas: groupInstance }));
});

// 新增多个分组
Router.post('/addList', async function (req, res) {
    const groupInstances = await commonVaildate(req, res, Groups, vaildateAdd, 'bulkCreate');
    groupInstances && res.send(baseSend(200, '', { datas: groupInstances, count: groupInstances.length }));
})

// 修改分组信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, Groups, vaildateModify, 'update', null, {
        where: {
            groupId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个分组
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await Groups.destroy({
        where: {
            groupId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;