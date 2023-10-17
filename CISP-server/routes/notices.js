const express = require("express");
const Notice = require("../models/notices");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加公告
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "content", "aId"],
    ["scanNumber"]
  );
}

// 验证修改公告
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["title", "content", "scanNumber"]);
}

// 获取所有公告
Router.get("/", async function (req, res, next) {
  const { important } = req.query;
  const options = {};
  important ?? (options.where = { important });
  handleDataEmpty(
    await Notice.findAndCountAll(options).catch(
      catchError(next, "请求的参数数据类型或值不满足要求")
    ),
    (result) =>
      res.send(baseSend(200, "", { datas: result.rows, count: result.count })),
    () => next("查询公告数据失败")
  );
});

// 分页获取公告
Router.get("/list", async function (req, res, next) {
  let { page, limit, important } = req.query;
  limit = +limit;
  if ((!page && page < 0) || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const options = {
    where: {
      limit,
      offset: (+page - 1) * limit,
    },
  };
  important ?? (options.where.important = important);
  handleDataEmpty(
    await Notice.findAndCountAll(options).catch(
      catchError(next, "请求的参数数据类型或值不满足要求")
    ),
    (result) =>
      res.send(baseSend(200, "", { datas: result.rows, count: result.count })),
    () => next("查询公告数据失败")
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

// 修改单个公告信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    commonValidate(req, next, Messages, validateModify, "update", null, {
      where: {
        messageId: +id,
      },
      returning: true,
    }),
    (data) => res.send(baseSend(200, "", { datas: data[1], count: data[0] })),
    () => next("传递的id有误，请检查")
  );
});

// 删除一个公告
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  handleDataEmpty(
    await Messages.destroy({
      where: {
        messageId: +id,
      },
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
