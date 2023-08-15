const express = require('express');
const SearchImgs = require('../models/searchImgs');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加寻人寻物图片
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['imgUrl', 'sId']);
}

// 验证修改
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['imgUrl']);
}

// 获取所有寻人寻物图片
Router.get('/', async function (req, res) {
    const { count, rows } = await SearchImgs.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
});

// // 分页获取寻人寻物图片（该功能应该不存在）
// Router.get('/list', async function (req, res) {
//     let { page, limit } = req.query;
//     limit = +limit;
//     if (page < 0 || !limit && limit < 0) {
//         // 请求未满足期望值
//         res.send(baseSend(417, ''));
//         return
//     }
//     const { rows, count } = await SearchImgs.findAndCountAll({
//         limit,
//         offset: (+page - 1) * limit
//     })
//     res.send(baseSend(200, '', { datas: rows, count }));
// });

// // 获取单个寻人寻物图片（该功能应该不存在）
// Router.get('/:id', async function (req, res) {
//     const { id } = req.params;
//     const query = await SearchImgs.findByPk(+id);
//     res.send(baseSend(200, '', { datas: query }));
// });

// 根据寻人寻物id获取所有图片
Router.get('/search/:id', async function (req, res) {
    const { id } = req.params;
    const { rows, count } = await SearchImgs.findAndCountAll({
        where: {
            sId: +id
        }
    });
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 新增一个寻人寻物图片
Router.post('/add', async function (req, res) {
    const SearchImgsInstance = await commonVaildate(req, res, SearchImgs, vaildateAdd, 'create');
    SearchImgsInstance && res.send(baseSend(200, '', { datas: SearchImgsInstance }));
});

// 新增多个寻人寻物图片
Router.post('/addList', async function (req, res) {
    const SearchImgsInstances = await commonVaildate(req, res, SearchImgs, vaildateAdd, 'bulkCreate');
    SearchImgsInstances && res.send(baseSend(200, '', { datas: SearchImgsInstances, count: SearchImgsInstances.length }));
});

// 修改单个寻人寻物图片信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, SearchImgs, vaildateModify, 'update', null, {
        where: {
            searchImgId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个寻人寻物图片
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await SearchImgs.destroy({
        where: {
            searchImgId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;