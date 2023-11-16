const express = require("express");
const New = require("../models/new");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加新闻
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "content", "aId"],
    ["scanNumber", "important"]
  );
}

// 获取新闻数量
Router.get("/count", async function (req, res) {
  handleDataEmpty(await New.count(), (data) =>
    res.send(baseSend(200, "", { datas: null, count: data }))
  );
});

// 获取重要新闻的数量
Router.get("/count/important", async function (req, res) {
  handleDataEmpty(
    await New.count({
      where: {
        important: true,
      },
    }),
    (data) => res.send(baseSend(200, "", { datas: null, count: data }))
  );
});

// 分页获取新闻
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await New.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
    order: [["createdAt", "DESC"]],
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("查询新闻数据失败")
  );
});

// 分页获取重要新闻
Router.get("/list/important", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await New.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
    where: {
      important: true,
    },
    order: [["createdAt", "DESC"]],
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("查询新闻数据失败")
  );
});

// 获取单个新闻
Router.get("/getOne/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await New.findByPk(+id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  handleDataEmpty(
    query,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个新闻
Router.post("/add", async function (req, res, next) {
  const NewsInstance = await commonValidate(
    req,
    next,
    New,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    NewsInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增新闻失败")
  );
});

// 删除一个新闻
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await New.destroy({
    where: {
      newId: +id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;