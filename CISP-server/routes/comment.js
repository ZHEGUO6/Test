const express = require("express");
const Comment = require("../models/comment");
const CommentReply = require("../models/commentReply");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加评论
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["content", "uId", "sId"], ["status"]);
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["status"]);
}

// 分页获取评论
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    catchError(next, "请求参数数据类型或值不匹配")();
    return;
  }
  handleDataEmpty(
    await Comment.findAndCountAll({
      limit,
      offset: (+page - 1) * limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CommentReply,
          as: "commentReplys",
          attributes: [
            "CommentReplyId",
            "uId",
            "content",
            "status",
            "createdAt",
          ],
        },
      ],
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 分页获取某一寻人寻物下的评论
Router.get("/search/list/:sId", async function (req, res, next) {
  let { page, limit } = req.query;
  const { sId } = req.params;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    catchError(next, "请求参数数据类型或值不匹配")();
    return;
  }
  handleDataEmpty(
    await Comment.findAndCountAll({
      where: {
        sId,
      },
      limit,
      offset: (+page - 1) * limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CommentReply,
          as: "commentReplys",
          attributes: [
            "CommentReplyId",
            "uId",
            "content",
            "status",
            "createdAt",
          ],
        },
      ],
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 获取单个评论
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await Comment.findByPk(+id).catch(
      catchError(next, "传递的数据类型有误，请检查")
    ),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个评论
Router.post("/add", async function (req, res, next) {
  handleDataEmpty(
    await commonValidate(req, next, Comment, validateAdd, "create"),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增评论失败")
  );
});

// 修改评论信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await commonValidate(req, next, Comment, validateModify, "update", null, {
      where: {
        commentId: +id,
      },
      returning: true,
    }),
    (data) =>
      res.send(baseSend(200, "", { datas: data[0], count: data[1] ?? 0 })),
    () => next("传递的id有误，请检查")
  );
});

// 删除一个评论
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  handleDataEmpty(
    await Comment.destroy({
      where: {
        commentId: +id,
      },
      individualHooks: true,
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
