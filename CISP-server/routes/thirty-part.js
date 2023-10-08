const UniSMS = require("unisms").default;
const express = require("express");
const { baseSend, catchError, readReqData } = require("../utils/server");
const { UNI_SMS_ACCESSORY_ID } = require("../config/env");

const Router = express.Router({ caseSensitive: true });

// 初始化
const client = new UniSMS({
  accessKeyId: UNI_SMS_ACCESSORY_ID,
});

Router.post("/sentMessage/forgetPwd", async (req, res, next) => {
  // 发送短信
  const body = await readReqData(req).catch((err) =>
    catchError(next, `传递的请求体有误，${err}`)()
  );
  if (!body) return;
  const { phone } = body;
  const code = Math.floor(Math.random() * 10000);
  const result = await client
    .send({
      to: phone,
      signature: "技术串烧",
      templateId: "pub_verif_forgetpass",
      templateData: {
        code,
      },
    })
    .catch((err) => err);
  const response = result.raw.data;
  if (result.status === 200) {
    // 响应成功
    res.send(
      baseSend(200, "短信发送成功", {
        ...response.data,
        code,
      })
    );
    return;
  }
  next(`短信发送失败，${response.message ?? "服务器错误"}`);
});

module.exports = Router;
