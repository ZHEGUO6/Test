require("./models");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const {
  AdminRouter,
  CommentReplyRouter,
  CommentRouter,
  FriendRouter,
  GroupRouter,
  NoticeRouter,
  MessageRouter,
  NewsRouter,
  SearchRouter,
  SearchImgRouter,
  UnableRouter,
  UserRouter,
  CaptchaRouter,
  ImageRouter,
  ThirtyPartRouter,
} = require("./routes");

const errorMiddleware = require("./middleware/errorMiddleWare");
const staticMiddleware = require("./middleware/staticMiddleWare");
const sequelize = require("./sequelize");
// 对数据库进行测试
// (async () => {
//   await sequelize.sync({ force: true });
// })();
const secret =
  Date.now().toString(36).slice(4) +
  Math.random().toString(36).slice(4) +
  "CISP-Alen";

const app = express();
app.use(staticMiddleware);
app.use(cookieParser(secret));
app.use(
  expressSession({
    rolling: true,
    saveUninitialized: false,
    secret,
    resave: false,
  })
);
app.use("/api/admin", AdminRouter);
app.use("/api/commentReply", CommentReplyRouter);
app.use("/api/comment", CommentRouter);
app.use("/api/friend", FriendRouter);
app.use("/api/group", GroupRouter);
app.use("/api/message", MessageRouter);
app.use("/api/notice", NoticeRouter);
app.use("/api/news", NewsRouter);
app.use("/api/search", SearchRouter);
app.use("/api/searchImg", SearchImgRouter);
app.use("/api/unable", UnableRouter);
app.use("/api/user", UserRouter);
app.use("/api/captcha", CaptchaRouter);
app.use("/api/static", ImageRouter);
app.use("/api/thirtyPart", ThirtyPartRouter);
app.use(errorMiddleware);
module.exports = app;
