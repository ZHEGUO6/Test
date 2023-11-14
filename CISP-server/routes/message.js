const express = require("express");
const Message = require("../models/message");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加消息
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "uId"],
    ["scanNumber", "content"]
  );
}

// 验证修改消息
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["title", "content", "scanNumber"]);
}

// 分页获取是否移入回收站的消息
const sendRemoveOrUnRemoveMessage = async (req, res, next, bool) => {
  let { page, limit } = req.query;
  const { id } = req.params;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await Message.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
    where: {
      uId: id,
      remove: bool,
    },
  }).catch(catchError(next, "请求的参数数据类型或值不满足要求"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("查询消息数据失败")
  );
};

// 分页获取某一用户的全部未移入回收站的消息
Router.get("/list/unremove/:id", async function (req, res, next) {
  return await sendRemoveOrUnRemoveMessage(req, res, next, false);
});

// 分页获取某一用户的全部已移入回收站的消息
Router.get("/list/remove/:id", async function (req, res, next) {
  return await sendRemoveOrUnRemoveMessage(req, res, next, true);
});

// 获取单个消息
Router.get("/getOne/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await Message.findByPk(+id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  handleDataEmpty(
    query,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个消息
Router.post("/add", async function (req, res, next) {
  const MessagesInstance = await commonValidate(
    req,
    next,
    Message,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    MessagesInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增消息失败")
  );
});

// 新增多个消息
Router.post("/addList", async function (req, res, next) {
  const MessagesInstances = await commonValidate(
    req,
    next,
    Message,
    validateAdd,
    "bulkCreate"
  );
  handleDataEmpty(
    MessagesInstances,
    (data) =>
      res.send(
        baseSend(200, "", {
          datas: data,
          count: data.length,
        })
      ),
    () => next("新增消息失败")
  );
});

// 删除一个消息
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await Message.destroy({
    where: {
      messageId: +id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
