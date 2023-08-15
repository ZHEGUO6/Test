const express = require('express');
const { baseSend } = require('../utils/server');
const Router = express.Router({ caseSensitivea: true });
const svgCaptcha = require('svg-captcha');
const { encrypt, meetEncrypt } = require('../utils/encryptOrDecrypt');
const set = new Set();

// 获取验证码
Router.get('/', async (req, res) => {
    const { data, text } = svgCaptcha.create({
        color: true,
        size: 6,
        width: 120,
        height: 40
    });

})
module.exports = Router;