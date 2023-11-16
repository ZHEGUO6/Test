const express = require("express");
const NewImg = require("../models/newImg");
const {
  baseSend,
  commonValidate,
  catchError,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });

// 验证添加新闻图片
async function validateAdd(info) {
  return await getMeetItemFromObj(info, ["imgUrl", "nId"], ["scanNumber"]);
}

// 获取某一新闻下的全部图片
Router.get("/:nId", async function (req, res) {
  const { nId } = req.params;
  handleDataEmpty(
    await NewImg.findAndCountAll({
      where: {
        nId,
      },
    }),
    (data) =>
      res.send(baseSend(200, "", { datas: data.rows, count: data.count }))
  );
});

// 新增一个新闻图片
Router.post("/add", async function (req, res, next) {
  const NewImgsInstance = await commonValidate(
    req,
    next,
    NewImg,
    validateAdd,
    "create"
  );
  handleDataEmpty(
    NewImgsInstance,
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增新闻失败")
  );
});

// 新增多个新闻图片
Router.post("/addList", async function (req, res, next) {
  const NewImgsInstances = await commonValidate(
    req,
    next,
    NewImg,
    validateAdd,
    "bulkCreate"
  );
  handleDataEmpty(
    NewImgsInstances,
    (data) => res.send(baseSend(200, "", { datas: data, count: data.length })),
    () => next("新增新闻失败")
  );
});

// 删除一个新闻图片
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  const deleteRows = await NewImg.destroy({
    where: {
      newImgId: +id,
    },
  }).catch(catchError(next, "传递的数据类型有误，请检查"));
  handleDataEmpty(
    deleteRows,
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("传递的id有误，请检查")
  );
});

module.exports = Router;
