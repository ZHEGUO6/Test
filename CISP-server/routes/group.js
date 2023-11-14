const express = require("express");
const Group = require("../models/group");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加分组
async function validateAdd(groupInfo) {
  return await getMeetItemFromObj(groupInfo, ["name", "uId"]);
}

// 验证修改
async function validateModify(groupInfo) {
  return await getMeetItemFromObj(groupInfo, [], ["name"]);
}

// 获取所有分组
Router.get("/", async function (req, res) {
  handleDataEmpty(await Group.findAndCountAll(), (data) =>
    res.send(baseSend(200, "", { datas: data.rows, count: data.count }))
  );
});

// 获取指定用户的所有分组
Router.get("/list/:uId", async function (req, res, next) {
  const { uId } = req.params;
  const result = await Group.findAndCountAll({
    where: {
      uId,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 获取单个分组
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await Group.findByPk(+id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  handleDataEmpty(
    query,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个分组
Router.post("/add", async function (req, res, next) {
  const groupInstance = await commonValidate(
    req,
    next,
    Group,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    groupInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增分组失败")
  );
});

// 新增多个分组
Router.post("/addList", async function (req, res, next) {
  const groupInstances = await commonValidate(
    req,
    next,
    Group,
    validateAdd,
    "bulkCreate"
  );
  handleDataEmpty(
    groupInstances,
    (data) => res.send(baseSend(200, "", { datas: data, count: data.length })),
    () => next("新增分组失败")
  );
});

// 修改分组信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    Group,
    validateModify,
    "update",
    null,
    {
      where: {
        groupId: +id,
      },
      returning: true,
    }
  );
  handleDataEmpty(
    result,
    (data) => res.send(baseSend(200, "", { datas: data[1], count: data[0] })),
    () => next("传递的id有误，请检查")
  );
});

// 删除一个分组
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await Group.destroy({
    where: {
      groupId: +id,
    },
    individualHooks: true,
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
