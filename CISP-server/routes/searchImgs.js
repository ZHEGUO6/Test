const express = require('express');
const SearchImgs = require('../models/searchImgs');
const { baseSend, commonValidate, catchError } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitive: true });

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

// 根据寻人寻物id获取所有图片
Router.get('/search/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await SearchImgs.findAndCountAll({
        where: {
            sId: +id
        }
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result.rows, count: result.count }));
});

// 新增一个寻人寻物图片
Router.post('/add', async function (req, res, next) {
    const SearchImgsInstance = await commonValidate(req, next, SearchImgs, vaildateAdd, 'create');
    if (SearchImgsInstance == null) {
        next('新增搜寻图片失败');
        return;
    }
    SearchImgsInstance && res.send(baseSend(200, '', { datas: SearchImgsInstance }));
});

// 新增多个寻人寻物图片
Router.post('/addList', async function (req, res, next) {
    const SearchImgsInstances = await commonValidate(req, next, SearchImgs, vaildateAdd, 'bulkCreate');
    if (SearchImgsInstances == null) {
        next('新增搜寻图片失败');
        return;
    }
    SearchImgsInstances && res.send(baseSend(200, '', { datas: SearchImgsInstances, count: SearchImgsInstances.length }));
});

// 修改单个寻人寻物图片信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonValidate(req, next, SearchImgs, vaildateModify, 'update', null, {
        where: {
            searchImgId: +id
        },
        returning: true
    });
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个寻人寻物图片
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await SearchImgs.destroy({
        where: {
            searchImgId: +id
        },
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (deleteRows == null) {
        next('传递的id有误，请检查');
        return;
    }
    typeof deleteRows === 'number' && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;