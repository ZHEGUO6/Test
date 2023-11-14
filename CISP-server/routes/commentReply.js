const express = require("express");
const CommentReply = require("../models/commentReply");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Comments = require("../models/comment");
const Router = express.Router({ caseSensitive: true });

// 验证添加评论回复
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["content", "uId", "cId"]);
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["content"]);
}

// 分页获取某一评论下的评论回复
Router.get("/list/:cId", async function (req, res, next) {
  let { page, limit } = req.query;
  const { cId } = req.params;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "传递的数据类型有误，请检查")();
  }
  handleDataEmpty(
    await CommentReply.findAndCountAll({
      where: {
        cId,
      },
      limit,
      offset: (+page - 1) * limit,
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 获取单个评论回复
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await CommentReply.findByPk(id).catch(
      catchError(next, "传递的数据类型有误，请检查")
    ),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个评论回复
Router.post("/add", async function (req, res, next) {
  // 剔除不需要的键值对
  handleDataEmpty(
    await commonValidate(
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
    ),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增评论回复失败")
  );
});

// 修改评论回复信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await commonValidate(
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
    ),
    (data) => res.send(baseSend(200, "", { datas: data[1], count: data[0] })),
    () => next("传递的id有误，请检查")
  );
});

// 删除一个评论回复
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  handleDataEmpty(
    await CommentReply.destroy({
      where: {
        CommentReplyId: +id,
      },
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
