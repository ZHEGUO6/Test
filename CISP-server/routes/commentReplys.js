const express = require('express');
const CommentReplys = require('../models/commentReplys');
const { baseSend, commonVaildate } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Comments = require('../models/comments');
const Router = express.Router({ caseSensitivea: true });

// 验证添加评论回复
async function vaildateAdd(info) {
    return await getMeetItemFromObj(info, ['content', 'uId', 'cId']);
}

// 验证修改
async function vaildateModify(info) {
    return await getMeetItemFromObj(info, [], ['content']);
}

// 获取某一评论的所有评论回复
Router.get('/comment/:cId', async function (req, res) {
    const { cId } = req.params;
    const { count, rows } = await CommentReplys.findAndCountAll({
        where: {
            cId
        }
    });
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 分页获取某一评论下的评论回复
Router.get('/list/:cId', async function (req, res) {
    let { page, limit } = req.query;
    const { cId } = req.params;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        res.send(baseSend(417, ''));
        return
    }
    const { rows, count } = await CommentReplys.findAndCountAll({
        where: {
            cId
        },
        limit,
        offset: (+page - 1) * limit
    })
    res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个评论回复
Router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const query = await CommentReplys.findByPk(+id);
    res.send(baseSend(200, '', { datas: query }));
});

// 新增一个评论回复
Router.post('/add', async function (req, res) {
    // 剔除不需要的键值对
    const CommentReplysInstance = await commonVaildate(req, res, CommentReplys, vaildateAdd, 'create', async item => {
        const cInstance = await Comments.findByPk(item.cId);
        if (cInstance.getDataValue('uId') === item.uId) {
            // 不能自己给自己回复
            res.send(baseSend(417, `仅允许他人给自己回复，请勿自回`));
            return false;
        }
        return true;
    });
    CommentReplysInstance && res.send(baseSend(200, '', { datas: CommentReplysInstance }));
});

// // 新增多个评论回复（目前没这个需求）
// Router.post('/addList', async function (req, res) {
//     const set = new Set();
//     const CommentReplysInstances = await commonVaildate(req, res, CommentReplys, vaildateAdd, 'bulkCreate',async (item) => {
//         if (set.has(item.uId)) {
//             res.send(baseSend(417, `传递了相同的用户id`));
//             return false;
//         }
//         set.add(item.uId);
//         return true;
//     });
//     CommentReplysInstances && res.send(baseSend(200, '', { datas: CommentReplysInstances, count: CommentReplysInstances.length }));
// })

// 修改评论回复信息
Router.put('/:id', async function (req, res) {
    const { id } = req.params;
    const result = await commonVaildate(req, res, CommentReplys, vaildateModify, 'update', null, {
        where: {
            CommentReplyId: +id
        },
        returning: true
    });
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个评论回复
Router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const deleteRows = await CommentReplys.destroy({
        where: {
            CommentReplyId: +id
        },
    });
    res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;