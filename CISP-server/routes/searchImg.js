const express = require("express");
const SearchImg = require("../models/searchImg");
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

// 新增一个寻人寻物图片
Router.post("/add", async function (req, res, next) {
  const SearchImgsInstance = await commonValidate(
    req,
    next,
    SearchImg,
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
    SearchImg,
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

// 删除一个寻人寻物图片
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await SearchImg.destroy({
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
