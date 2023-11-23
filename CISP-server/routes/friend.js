const express = require("express");
const { Group, Friend, User } = require("../models");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const { Op } = require("sequelize");
const Router = express.Router({ caseSensitive: true });

// 验证添加朋友
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["uId", "fId", "gId", "note"]);
}

async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["note", "gId"]);
}

// 获取某一用户的所有朋友数量
Router.get("/count/:uId", async function (req, res, next) {
  const { uId } = req.params;
  handleDataEmpty(
    await Friend.count({
      include: [{ model: User, as: "user_Friend" }],
      where: {
        uId,
      },
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

// 分页获取某一用户某一分组的所有朋友
Router.get("/list/:uId/:gId", async function (req, res, next) {
  const { uId, gId } = req.params;
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "传递的数据类型有误，请检查")();
  }
  handleDataEmpty(
    await Friend.findAndCountAll({
      include: [{ model: User, as: "user_Friend" }],
      where: {
        uId,
        gId,
      },
      limit,
      offset: (+page - 1) * limit,
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: data, count: data.length })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个朋友
Router.post("/add", async function (req, res, next) {
  const FriendsInstance = await commonValidate(
    req,
    next,
    Friend,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    FriendsInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 修改朋友信息
Router.put("/:fId", async function (req, res, next) {
  const { fId } = req.params;
  const result = await commonValidate(
    req,
    next,
    Friend,
    validateModify,
    "update",
    {
      where: {
        friendId: fId,
      },
      returning: true,
    }
  );
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data[0], count: data[1] ?? 0 })),
    () => next("传递的id有误，请检查")
  );
});

// 删除一个朋友
Router.delete("/:fId", async function (req, res, next) {
  const { fId } = req.params;
  const deleteRows = await Friend.destroy({
    where: {
      friendId: fId,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
