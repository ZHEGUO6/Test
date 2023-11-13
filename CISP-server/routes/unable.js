const express = require("express");
const Unable = require("../models/unable");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加禁用记录
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["unAccessMsg", "uId"]);
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["unAccessMsg"]);
}

// 获取所有禁用记录
Router.get("/", async function (req, res) {
  handleDataEmpty(await Unable.findAndCountAll(), ({ count, rows }) =>
    res.send(baseSend(200, "", { datas: rows, count }))
  );
});

// 分页获取禁用记录
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await Unable.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("查询禁用记录数据失败")
  );
});

// 获取单个禁用记录
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await Unable.findByPk(id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  handleDataEmpty(
    query,
    (data) => res.send(baseSend(200, "", { datas: query })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个禁用记录
Router.post("/add", async function (req, res, next) {
  const unableInstance = await commonValidate(
    req,
    next,
    Unable,
    validateAdd,
    "create",
    async (item) => {
      const has = await Unable.findOne({
        where: {
          uId: item.uId,
        },
      });
      if (has) {
        return catchError(next, "该用户已经被禁用了，无法多次禁用")();
      }
      return true;
    }
  );
  handleDataEmpty(
    unableInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增禁用记录失败")
  );
});

// 新增多个禁用记录
Router.post("/addList", async function (req, res, next) {
  const set = new Set();
  const unabledInstances = await commonValidate(
    req,
    next,
    Unable,
    validateAdd,
    "bulkCreate",
    async (item) => {
      if (set.has(item.uId)) {
        return catchError(next, `传递了相同的用户id`)();
      }
      const has = await Unable.findOne({
        where: {
          uId: item.uId,
        },
      });
      if (has) {
        return catchError(next, "该用户已经被禁用了，无法多次禁用")();
      }
      set.add(item.uId);
      return true;
    }
  );
  handleDataEmpty(
    unabledInstances,
    (data) =>
      res.send(
        baseSend(200, "", {
          datas: data,
          count: data.length,
        })
      ),
    () => next("新增禁用记录失败")
  );
});

// 修改禁用记录信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    Unable,
    validateModify,
    "update",
    null,
    {
      where: {
        unabledId: id,
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

// 删除一个禁用记录
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await Unable.destroy({
    where: {
      unabledId: id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
