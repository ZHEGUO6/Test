const express = require("express");
const Admins = require("../models/admins");
const {
  baseSend,
  commonValidate,
  catchError,
  readReqData,
  handleDataEmpty,
} = require("../utils/server");
const { getMeetItemFromObj } = require("../utils/object");
const Router = express.Router({ caseSensitive: true });
const { encrypt, meetEncrypt } = require("../utils/encryptOrDecrypt");
const { getRandom } = require("../utils/math");
const fs = require("fs");
const path = require("path");

// 验证添加管理员
async function validateAddAdmin(adminInfo) {
  return await getMeetItemFromObj(
    adminInfo,
    [
      [
        "loginPwd",
        (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd))),
      ],
    ],
    [
      "nickname",
      "enabled",
      "permission",
      [
        "avatar",
        async (avatar) => {
          if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(
              path.resolve(__dirname, "../public/images")
            );
            return `http://localhost:${
              process.env.PORT || 3000
            }/static/images/${images[getRandom(1, images.length - 1)]}`;
          }
          return avatar;
        },
      ],
    ]
  );
}

// 验证修改管理员
async function validateModifyAdmin(adminInfo) {
  return await getMeetItemFromObj(
    adminInfo,
    [],
    [
      [
        "loginPwd",
        (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd))),
      ],
      [
        "avatar",
        async (avatar) => {
          if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(
              path.resolve(__dirname, "../public/images")
            );
            return `http://localhost:${
              process.env.PORT || 3000
            }/public/images/${images[getRandom(1, images.length - 1)]}`;
          }
        },
      ],
      "nickname",
      "enabled",
      "permission",
    ]
  );
}

// 获取所有管理员
Router.get("/", async function (req, res, next) {
  handleDataEmpty(await Admins.findAndCountAll(), ({ rows, count }) =>
    res.send(baseSend(200, "", { datas: rows, count }))
  );
});

// 分页获取管理员
Router.get("/list", async function (req, res, next) {
  let { page, limit } = req.query;
  limit = +limit;
  if (page < 0 || (!limit && limit < 0)) {
    // 请求未满足期望值
    return catchError(next, `请求参数数据类型或值不对`)();
  }
  handleDataEmpty(
    await Admins.findAndCountAll({
      limit,
      offset: (+page - 1) * limit,
    }).catch(catchError(next, "传递的数据类型有误，请检查")),
    (result) =>
      res.send(baseSend(200, "", { datas: result.rows, count: result.count }))
  );
});

// 获取单个管理员
Router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await Admins.findByPk(id).catch(catchError(next, "传递的数据类型有误")),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("传递的id有误，获取管理员信息失败")
  );
});

// 验证帐号密码是否正确
Router.post("/validate", async function (req, res, next) {
  const body = await readReqData(req).catch((err) => catchError(next, err)());
  if (!body) return;
  const { nickname, loginPwd } = body;
  handleDataEmpty(
    await Admins.findOne({
      where: {
        nickname,
        loginPwd: encrypt(meetEncrypt(loginPwd)),
      },
    }).catch(catchError(next, "传递的数据类型有误")),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("帐号或密码不正确")
  );
});

// 管理员登录
Router.post("/login", async function (req, res, next) {
  // 验证登录是否成功
  const body = await readReqData(req).catch((err) =>
    catchError(next, `传递的请求体有误，${err}`)()
  );
  if (!body) return;
  const { nickname, loginPwd, saveTime = 1000 * 60 } = body;
  handleDataEmpty(
    await Admins.findOne({
      where: { nickname, loginPwd: encrypt(meetEncrypt(loginPwd)) },
    }).catch(catchError(next, "传递的数据类型有误，登录失败")),
    (data) => {
      req.session.adminId = data.getDataValue("loginId");
      req.session.cookie.maxAge = saveTime;
      res.send(baseSend(200, "登录成功", { datas: data }));
    },
    () => next("登录失败，帐号或密码有误")
  );
});

// 管理员恢复登录状态
Router.get("/login/whoAmI", async function (req, res, next) {
  if (req.session.adminId) {
    handleDataEmpty(
      await Admins.findByPk(req.session.adminId).catch(
        catchError(next, `登录信息有误，请重新登录`)
      ),
      (data) => res.send(baseSend(200, "恢复登录成功", { datas: data })),
      () => next("登录信息已失效，请重新登录")
    );
    return;
  }
  next("登录信息已失效，请重新登录");
});

// 管理员退出登录
Router.post("/logout", async function (req, res, next) {
  req.session.adminId = null;
  res.send(baseSend(200, "退出登录成功"));
});

// 新增一个管理员
Router.post("/add", async function (req, res, next) {
  handleDataEmpty(
    await commonValidate(req, next, Admins, validateAddAdmin, "create"),
    (data) => res.send(baseSend(200, "", { datas: data })),
    () => next("新增管理员失败")
  );
});

// 新增多个管理员
Router.post("/addList", async function (req, res, next) {
  handleDataEmpty(
    await commonValidate(req, next, Admins, validateAddAdmin, "bulkCreate"),
    (data) => res.send(baseSend(200, "", { datas: data, count: data.length })),
    () => next("新增管理员失败")
  );
});

// 修改管理员信息
Router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  handleDataEmpty(
    await commonValidate(
      req,
      next,
      Admins,
      validateModifyAdmin,
      "update",
      null,
      {
        where: {
          loginId: id,
        },
        returning: true,
      }
    ),
    (data) => res.send(baseSend(200, "", { datas: data[1], count: data[0] })),
    () => next("修改管理员信息失败")
  );
});

// 删除一个管理员
Router.delete("/:id", async function (req, res, next) {
  const id = req.params.id;
  handleDataEmpty(
    await Admins.destroy({
      where: {
        loginId: id,
      },
    }).catch(catchError(next, `传递的数据格式不对，请更正后再操作`)),
    (data) => res.send(baseSend(200, "", { datas: null, count: data })),
    () => next("删除管理员失败")
  );
});

module.exports = Router;
