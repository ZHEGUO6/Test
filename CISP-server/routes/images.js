// 处理头像
const fs=require('fs');
const path=require('path');
const express = require("express");
const Router = express.Router({ caseSensitive: true });
const { baseSend,readImageReqData, catchError} = require('../utils/server');
const uuidv4=require('uuidv4')

// 获取全部系统自带头像
Router.get('/image/all', async function (req, res, next) {
    const basePath=path.resolve(__dirname,'../public/images');
    const files= await fs.promises.readdir(basePath);
    res.send(baseSend(200,'',{datas:files.map(i=>`http://localhost:${process.env.PORT || 3000}/static/images/${i}`),count:files.length}))
});

// 上传图片
Router.post('/upload/add',async function(req,res,next){
    const data = await readImageReqData(req).catch(err => catchError(next, err)());
    if (!data) return;
    const success= await fs.promises.writeFile(path.resolve(__dirname,`../public/upload/${uuidv4.uuid()}.${req.headers["content-type"]}`),data).catch(err => catchError(next, err)());
    if(!success)return;
    res.send(baseSend(200, ''));

})

module.exports = Router;