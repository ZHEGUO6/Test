const express = require("express");
const Friend = require("../models/friend");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const sequelize = require("../sequelize");
const { QueryTypes } = require("sequelize");
const Router = express.Router({ caseSensitive: true });

// 验证添加朋友
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["uId", "fId", "gId", "note"]);
}

async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["note"]);
}

// 获取某一用户的所有朋友
Router.get("/:uId", async function (req, res, next) {
  const { uId } = req.params;
  handleDataEmpty(
    await sequelize
      .query(
        "SELECT USERS.* FROM FRIENDS INNER JOIN USERS ON Friend.fid = USERS.loginid WHERE UID = $1 AND FRIENDS.deletedAt IS NULL AND USERS.deletedAt IS NULL",
        {
          bind: [uId],
          type: QueryTypes.SELECT,
        }
      )
      .catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: data, count: data.length })),
    () => next("传递的id有误，请检查")
  );
});

// 获取某一用户某一分组的所有朋友
Router.get("/:uId/:gId", async function (req, res, next) {
  const { uId, gId } = req.params;
  handleDataEmpty(
    await sequelize
      .query(
        "SELECT USERS.* FROM FRIENDS INNER JOIN USERS ON Friend.fid = USERS.loginid WHERE UID = $1 AND GID = $2 AND FRIENDS.deletedAt IS NULL AND USERS.deletedAt IS NULL",
        {
          bind: [uId, gId],
          type: QueryTypes.SELECT,
        }
      )
      .catch(catchError(next, "传递的数据类型有误，请检查")),
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
    "create",
    async ({ uId, fId }) => {
      const has = await Friend.findOne({
        where: {
          uId,
          fId,
        },
      });
      if (has) {
        return catchError(next, `该朋友已经存在，请勿多次添加`)();
      }
      return true;
    }
  );
  handleDataEmpty(
    FriendsInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增多个朋友
Router.post("/addList", async function (req, res, next) {
  const set = new Set();
  const FriendsInstances = await commonValidate(
    req,
    next,
    Friend,
    validateAdd,
    "bulkCreate",
    async ({ uId, fId }) => {
      if (set.has(fId)) {
        return catchError(next, `传递了相同的用户id`)();
      }
      set.add(fId);
      const has = await Friend.findOne({
        where: {
          uId,
          fId,
        },
      });
      if (has) {
        return catchError(next, `该朋友已经存在，请勿多次添加`)();
      }
      return true;
    }
  );
  handleDataEmpty(
    FriendsInstances,
    (data) =>
      res.send(
        baseSend(200, "", {
          datas: data,
          count: data.length,
        })
      ),
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
    null,
    {
      where: {
        friendId: fId,
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
