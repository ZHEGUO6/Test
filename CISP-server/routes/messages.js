const express = require("express");
const Messages = require("../models/messages");
const { baseSend, commonValidate, catchError } = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加消息
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "content", "aId"],
    ["scanNumber"]
  );
}

// 验证修改消息
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["title", "content", "scanNumber"]);
}

// 获取所有消息
Router.get("/", async function (req, res) {
  const { count, rows } = await Messages.findAndCountAll();
  res.send(baseSend(200, "", { datas: rows, count }));
});

// 分页获取消息
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await Messages.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
  }).catch(catchError(next, "请求的参数数据类型或值不满足要求"));
  if (result == null) {
    next("查询消息数据失败");
    return;
  }
  result &&
    res.send(baseSend(200, "", { datas: result.rows, count: result.count }));
});

// 获取单个消息
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await Messages.findByPk(+id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  if (query == null) {
    next("传递的id有误，请检查");
    return;
  }
  res.send(baseSend(200, "", { datas: query }));
});

// 新增一个消息
Router.post("/add", async function (req, res, next) {
  const MessagesInstance = await commonValidate(
    req,
    next,
    Messages,
    validateAdd,
    "create"
  );
  if (MessagesInstance == null) {
    next("新增消息失败");
    return;
  }
  MessagesInstance && res.send(baseSend(200, "", { datas: MessagesInstance }));
});

// 新增多个消息
Router.post("/addList", async function (req, res, next) {
  const MessagesInstances = await commonValidate(
    req,
    next,
    Messages,
    validateAdd,
    "bulkCreate"
  );
  if (MessagesInstances == null) {
    next("新增消息失败");
    return;
  }
  MessagesInstances &&
    res.send(
      baseSend(200, "", {
        datas: MessagesInstances,
        count: MessagesInstances.length,
      })
    );
});

// 修改单个消息信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    Messages,
    validateModify,
    "update",
    null,
    {
      where: {
        messageId: +id,
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

// 删除一个消息
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await Messages.destroy({
    where: {
      messageId: +id,
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
