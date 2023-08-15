const express = require('express');
const Comments = require('../models/comments');
const { baseSend, commonVaildate } = require('../utils/server');
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
Router.get('/list', async function (req, res) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await Comments.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取某一寻人寻物下的所有评论
Router.get('/search/:sId', async function (req, res) {
    const { sId } = req.params;
    const { count, rows } = await Comments.findAndCountAll({
        where: {
            sId
        }
    });
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 分页获取某一寻人寻物下的评论
Router.get('/search/list/:sId', async function (req, res) {
    let { page, limit } = req.query;
    const { sId } = req.params;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await Comments.findAndCountAll({
        where: {
            sId
        },
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个评论
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await Comments.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个评论
Router.post('/add', async function (req, res) {
    const CommentsInstance = await commonVaildate(req, res, Comments, vaildateAdd, 'create');
    CommentsInstance && res.send(baseSend(200, '', { datas: CommentsInstance }));
});

// // 新增多个评论（目前没这个需求）
// Router.post('/addList', async function (req, res) {
//     const set = new Set();
//     const CommentsInstances = await commonVaildate(req, res, Comments, vaildateAdd, 'bulkCreate',async item => {
//         if (set.has(item.uId)) {
//             res.send(baseSend(417, `传递了相同的用户id`));
//             return false;
//         }
//         set.add(item.uId);
//         return true;
//     });
//     CommentsInstances && res.send(baseSend(200, '', { datas: CommentsInstances, count: CommentsInstances.length }));
// })

// 修改评论信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, Comments, vaildateModify, 'update', null, {
        where: {
            commentId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个评论
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await Comments.destroy({
        where: {
            commentId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;