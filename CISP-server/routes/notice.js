const express = require("express");
const Notice = require("../models/notice");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const { fn, col } = require("sequelize");
const Router = express.Router({ caseSensitive: true });

// 验证添加公告
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "content", "aId"],
    ["scanNumber", "important"]
  );
}

// 验证修改公告
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["important"]);
}

// 获取所有公告数量
Router.get("/count", async function (req, res, next) {
  handleDataEmpty(
    await Notice.findAll({
      group: "important",
      attributes: [[fn("count", col("important")), "count"], "important"],
    }).catch(catchError(next, "请求的参数数据类型或值不满足要求")),
    (result) => res.send(baseSend(200, "", result)),
    () => next("查询公告数据失败")
  );
});

// 分页获取公告
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if ((!page && page < 0) || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  handleDataEmpty(
    await Notice.findAndCountAll({
      limit,
      offset: (+page - 1) * limit,
      order: [["createdAt", "DESC"]],
    }).catch(catchError(next, "请求的参数数据类型或值不满足要求")),
    (result) =>
      res.send(baseSend(200, "", { datas: result.rows, count: result.count })),
    () => next("查询公告数据失败")
  );
});

// 分页获取重要公告
Router.get("/list/important", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await Notice.findAndCountAll({
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

// 获取单个公告
Router.get("/getOne/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await Notice.findByPk(+id).catch(
      catchError(next, "传递的数据类型有误，请检查")
    ),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个公告
Router.post("/add", async function (req, res, next) {
  handleDataEmpty(
    await commonValidate(req, next, Notice, validateAdd, "create"),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增公告失败")
  );
});

// 新增多个公告
Router.post("/addList", async function (req, res, next) {
  handleDataEmpty(
    await commonValidate(req, next, Notice, validateAdd, "bulkCreate"),
    (data) =>
      res.send(
        baseSend(200, "", {
          datas: data,
          count: data.length,
        })
      ),
    () => next("新增公告失败")
  );
});

// 修改一个公告
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const count = await commonValidate(
    req,
    next,
    Notice,
    validateModify(),
    "update",
    { where: { noticeId: id } }
  );
  handleDataEmpty(
    count,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("更新公告信息失败")
  );
});

// 修改浏览数量
Router.put("/increase/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    Notice,
    validateModify,
    "increment",
    {
      where: {
        noticeId: id,
      },
    },
    ({ scanNumber }) => {
      return !(scanNumber && +scanNumber !== 1);
    }
  );
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data[0], count: data[1] ?? 0 })),
    () => next("传递的id有误，请检查")
  );
});

// 删除一个公告
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  handleDataEmpty(
    await Notice.destroy({
      where: {
        noticeId: +id,
      },
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
