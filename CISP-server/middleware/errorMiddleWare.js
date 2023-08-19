const { baseSend } = require('../utils/server');
// 对错误进行统一处理
module.exports = async (err, req, res, next) => {
    if (err) {
        res.status(417).send(baseSend(417, err));
    }
    next();
}