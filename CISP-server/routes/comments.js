const express = require('express');
const Comments = require('../models/comments');
const { baseSend, commonVaildate, catchError } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });

// 验证添加评论
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['content', 'uId', 'sId']);
}

// 验证修改
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['content']);
}

// 获取所有评论
Router.get('/', async function (req, res) {
    const { count, rows } = await Comments.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 分页获取评论
Router.get('/list', async function (req, res, next) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        return catchError(next, '传递的数据类型有误，请检查')();
    }
    const result = await Comments.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('查询评论数据失败');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result.rows, count: result.count }));
});

// 获取某一寻人寻物下的所有评论
Router.get('/search/:sId', async function (req, res, next) {
    const { sId } = req.params;
    const result = await Comments.findAndCountAll({
        where: {
            sId
        }
    }).catch(catchError(next, '传递的数据类型有误'));
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result.rows, count: result.count }));
})

// 分页获取某一寻人寻物下的评论
Router.get('/search/list/:sId', async function (req, res, next) {
    let { page, limit } = req.query;
    const { sId } = req.params;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        catchError(next, '请求参数数据类型或值不匹配')();
        return
    }
    const result = await Comments.findAndCountAll({
        where: {
            sId
        },
        limit,
        offset: (+page - 1) * limit
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result.rows, count: result.count }));
});

// 获取单个评论
Router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    const query = await Comments.findByPk(+id).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (query == null) {
        next('传递的id有误，请检查');
        return;
    }
    query && res.send(baseSend(200, '', { datas: query }));
});

// 新增一个评论
Router.post('/add', async function (req, res, next) {
    const CommentsInstance = await commonVaildate(req, next, Comments, vaildateAdd, 'create');
    if (CommentsInstance == null) {
        next('新增评论失败');
        return;
    }
    CommentsInstance && res.send(baseSend(200, '', { datas: CommentsInstance }));
});

// 修改评论信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonVaildate(req, next, Comments, vaildateModify, 'update', null, {
        where: {
            commentId: +id
        },
        returning: true
    });
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个评论
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await Comments.destroy({
        where: {
            commentId: +id
        },
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    deleteRows && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;