const express = require("express");
const News = require("../models/news");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const { data } = require("express-session/session/cookie");
const Router = express.Router({ caseSensitive: true });

// 验证添加新闻
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "content", "aId"],
    ["scanNumber"]
  );
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["title", "content", "scanNumber"]);
}

// 获取所有新闻
Router.get("/", async function (req, res) {
  const { important } = req.query;
  const options = {};
  important ?? (options.where = { important });
  handleDataEmpty(await News.findAndCountAll(options), (data) =>
    res.send(baseSend(200, "", { datas: data.rows, count: data.count }))
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
  const result = await News.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
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
  const result = await News.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
    where: {
      important: true,
    },
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
  const query = await News.findByPk(+id).catch(
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
    News,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    NewsInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增新闻失败")
  );
});

// 新增多个新闻
Router.post("/addList", async function (req, res, next) {
  const NewsInstances = await commonValidate(
    req,
    next,
    News,
    validateAdd,
    "bulkCreate"
  );
  handleDataEmpty(
    NewsInstances,
    (data) => res.send(baseSend(200, "", { datas: data, count: data.length })),
    () => next("新增新闻失败")
  );
});

// 修改单个新闻信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    News,
    validateModify,
    "update",
    null,
    {
      where: {
        newId: +id,
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

// 删除一个新闻
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await News.destroy({
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
