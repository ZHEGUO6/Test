// 处理头像
const fs = require("fs");
const path = require("path");
const express = require("express");
const Router = express.Router({ caseSensitive: true });
const { baseSend, readImageReqData, catchError } = require("../utils/server");
const uuidv4 = require("uuidv4");
const multer = require("multer");

const rootResponseUrl = `http://localhost:${process.env.PORT || 3000}/static`;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4.uuid() + file.originalname);
  },
});

const upload = multer({ storage });

// 获取全部系统自带头像
Router.get("/image/all", async function (req, res, next) {
  const basePath = path.resolve(__dirname, "../public/images");
  const files = await fs.promises.readdir(basePath);
  res.send(
    baseSend(200, "", {
      datas: files.map((i) => `${rootResponseUrl}/images/${i}`),
      count: files.length,
    })
  );
});

// 上传图片
Router.post(
  "/upload/add",
  upload.single("file"),
  async function (req, res, next) {
    // const data = await readImageReqData(req).catch((err) =>
    //   catchError(next, err)()
    // );
    // if (!data) return;
    //
    // const baseLastUrl = `/upload/${uuidv4.uuid()}-${
    //   data.match(/filename="(\S+)"/)[1]
    // }`;

    // const boundary = req.headers["content-type"].match(/boundary=(\S+)/)[1];
    // const f = data.indexOf("RIFF");
    // const l = data.lastIndexOf(boundary) - 4;
    // console.log(data.slice(f, l));
    // console.log(Buffer.alloc(l - f + 1, data.slice(f, l)));
    // const responseUrl = `http://localhost:3000/static/${baseLastUrl}`;
    // const success = await fs.promises
    //   .writeFile(
    //     path.resolve(__dirname, `../public/${baseLastUrl}`),
    //     Buffer.from(
    //       data.slice(data.indexOf("RIFF"), data.lastIndexOf(boundary) - 2)
    //     )
    //   )
    //   .catch((err) => catchError(next, err)());
    // if (success === undefined) {
    //   res.send(baseSend(200, "", responseUrl));
    // }
    res.send(
      baseSend(200, "", `${rootResponseUrl}/upload/${req.file.filename}`)
    );
  }
);

module.exports = Router;
