const express = require("express");
const Search = require("../models/search");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加寻人寻物
async function validateAdd(info) {
  return await getMeetItemFromObj(
    info,
    ["title", "intro", "uId"],
    ["commentNumber", "scanNumber"]
  );
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(
    info,
    [],
    ["title", "intro", "commentNumber", "scanNumber"]
  );
}

// 获取所有寻人寻物
Router.get("/", async function (req, res) {
  const result = await Search.findAndCountAll();
  handleDataEmpty(result, ({ count, rows }) =>
    res.send(baseSend(200, "", { datas: rows, count }))
  );
});

// 分页获取寻人寻物
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await Search.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("查询搜寻数据失败")
  );
});

// 根据类型获取所有寻人寻物
Router.get("/type/:typeId", async function (req, res, next) {
  const { typeId } = req.params;
  const result = await Search.findAndCountAll({
    where: {
      typeId,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 根据类型分页获取寻人寻物
Router.get("/list/type/:typeId", async function (req, res, next) {
  let { page, limit } = req.query;
  const { typeId } = req.params;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, "请求的参数数据类型或值不满足要求")();
  }
  const result = await Search.findAndCountAll({
    limit,
    offset: (+page - 1) * limit,
    where: {
      typeId,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 获取单个寻人寻物
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  const query = await Search.findByPk(+id).catch(
    catchError(next, "传递的数据类型有误，请检查")
  );
  handleDataEmpty(
    query,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个寻人寻物
Router.post("/add", async function (req, res, next) {
  const SearchesInstance = await commonValidate(
    req,
    next,
    Search,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    SearchesInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增搜寻失败")
  );
});

// 新增多个寻人寻物 (暂时不添加该功能)
Router.post("/addList", async function (req, res, next) {
  const SearchesInstances = await commonValidate(
    req,
    next,
    Search,
    validateAdd,
    "bulkCreate"
  );
  handleDataEmpty(
    SearchesInstances,
    (data) =>
      res.send(
        baseSend(200, "", {
          datas: data,
          count: data.length,
        })
      ),
    () => next("新增搜寻失败")
  );
});

// 修改单个寻人寻物信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    Search,
    validateModify,
    "update",
    null,
    {
      where: {
        searchId: +id,
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

// 删除一个寻人寻物
Router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  const deleteRows = await Search.destroy({
    where: {
      searchId: id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
