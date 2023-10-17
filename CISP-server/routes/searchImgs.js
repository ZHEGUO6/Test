const express = require("express");
const SearchImgs = require("../models/searchImgs");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加寻人寻物图片
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["imgUrl", "sId"]);
}

// 验证修改
async function validateModify(info) {
  return await getMeetItemFromObj(info, [], ["imgUrl"]);
}

// 获取所有寻人寻物图片
Router.get("/", async function (req, res) {
  handleDataEmpty(await SearchImgs.findAndCountAll(), ({ count, rows }) =>
    res.send(baseSend(200, "", { datas: rows, count }))
  );
});

// 根据寻人寻物id获取所有图片
Router.get("/search/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await SearchImgs.findAndCountAll({
    where: {
      sId: +id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    result,
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count })),
    () => next("传递的id有误，请检查")
  );
});

// 新增一个寻人寻物图片
Router.post("/add", async function (req, res, next) {
  const SearchImgsInstance = await commonValidate(
    req,
    next,
    SearchImgs,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    SearchImgsInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增搜寻图片失败")
  );
});

// 新增多个寻人寻物图片
Router.post("/addList", async function (req, res, next) {
  const SearchImgsInstances = await commonValidate(
    req,
    next,
    SearchImgs,
    validateAdd,
    "bulkCreate"
  );
  handleDataEmpty(
    SearchImgsInstances,
    (data) =>
      res.send(
        baseSend(200, "", {
          datas: data,
          count: data.length,
        })
      ),
    () => next("新增搜寻图片失败")
  );
});

// 修改单个寻人寻物图片信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const result = await commonValidate(
    req,
    next,
    SearchImgs,
    validateModify,
    "update",
    null,
    {
      where: {
        searchImgId: +id,
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

// 删除一个寻人寻物图片
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await SearchImgs.destroy({
    where: {
      searchImgId: +id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
