const express = require("express");
const CommentReply = require("../models/commentReplys");
const { baseSend, commonValidate, catchError } = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Comments = require("../models/comments");
const Router = express.Router({ caseSensitive: true });

// 验证添加评论回复
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["content", "uId", "cId"]);
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["content"]);
}

// 获取某一评论的所有评论回复
Router.get("/comment/:cId", async function (req, res, next) {
  const { cId } = req.params;
  const result = await CommentReply.findAndCountAll({
    where: {
      cId,
    },
  }).catch(catchError(next, "传递的id有误，请检查"));
  if (result == null) {
    next("传递的id有误，请检查");
    return;
  }
  result &&
    res.send(baseSend(200, "", { datas: result.rows, count: result.count }));
});

// 分页获取某一评论下的评论回复
Router.get("/list/:cId", async function (req, res, next) {
  let { page, limit } = req.query;
  const { cId } = req.params;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "传递的数据类型有误，请检查")();
  }
  const result = await CommentReply.findAndCountAll({
    where: {
      cId,
    },
    limit,
    offset: (+page - 1) * limit,
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  if (result == null) {
    next("传递的id有误，请检查");
    return;
  }
  result &&
    res.send(baseSend(200, "", { datas: result.rows, count: result.count }));
});

// 获取单个评论回复
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await CommentReply.findByPk(id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  if (query == null) {
    next("传递的id有误，请检查");
    return;
  }
  query && res.send(baseSend(200, "", { datas: query }));
});

// 新增一个评论回复
Router.post("/add", async function (req, res, next) {
  // 剔除不需要的键值对
  const CommentReplyInstance = await commonValidate(
    req,
    next,
    CommentReply,
    validateAdd,
    "create",
    async (item) => {
      const cInstance = await Comments.findByPk(item.cId);
      if (cInstance.getDataValue("uId") === item.uId) {
        // 不能自己给自己回复
        return catchError(next, "仅允许他人给自己回复，请勿自回")();
      }
      return true;
    }
  );
  if (CommentReplyInstance == null) {
    next("新增评论回复失败");
    return;
  }
  CommentReplyInstance &&
    res.send(baseSend(200, "", { datas: CommentReplyInstance }));
});

// 修改评论回复信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    CommentReply,
    validateModify,
    "update",
    null,
    {
      where: {
        CommentReplyId: +id,
      },
      returning: true,
    }
  );
  if (result == null) {
    next("传递的id有误，请检查");
    return;
  }
  result && res.send(baseSend(200, "", { datas: result[1], count: result[0] }));
});

// 删除一个评论回复
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await CommentReply.destroy({
    where: {
      CommentReplyId: +id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  if (deleteRows == null) {
    next("传递的id有误，请检查");
    return;
  }
  typeof deleteRows === "number" &&
    res.send(baseSend(200, "", { datas: null, count: deleteRows }));
});

module.exports = Router;
