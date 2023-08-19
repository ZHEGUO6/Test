const express = require('express');
const { baseSend, readReqData, catchError } = require('../utils/server');
const Router = express.Router({ caseSensitivea: true });
const svgCaptcha = require('svg-captcha');
const { encrypt, meetEncrypt } = require('../utils/encryptOrDecrypt');

// 获取验证码
Router.get('/', async (req, res) => {
    const { data, text } = svgCaptcha.create({
        color: true,
        size: 6,
        width: 120,
        height: 40
    });
    res.cookie('captcha', encrypt(meetEncrypt(text)), {
        maxAge: 1000 * 60 * 2,
        httpOnly: true,
        signed: true
    });
    res.setHeader('Content-Type', 'image/svg');
    res.send(data);
})

// 检测验证码是否正确
Router.post('/vaildate', async (req, res, next) => {
    const body = await readReqData(req).catch(err => catchError(next, `传递的请求体有误，${err}`)());
    if (!body) {
        return
    }
    if (req.signedCookies.captcha) {
        encrypt(meetEncrypt(body.captcha)) === req.signedCookies.captcha ? res.send(baseSend(200, '验证已通过')) : res.send(baseSend(417, '验证码有误，请重新输入验证码'));
        req.signedCookies.captcha = null;
        return
    }
    res.send(baseSend(417, '验证码已过期，请重新获取验证码'));
})
module.exports = Router;