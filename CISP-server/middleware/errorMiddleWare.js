const { baseSend } = require('../utils/server');
// 对错误进行统一处理
module.exports = async (err, req, res, next) => {
    res.send(baseSend(417, err));
}