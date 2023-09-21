const aes = require('aes-js');
const key = [1, 6, 49, 2, 2, 7, 89, 8, 2, 1, 37, 96, 3, 61, 5, 1];

// The initialization vector (must be 16 bytes)
const iv = [10, 21, 7, 9, 1, 6, 25, 6, 8, 18, 7, 2, 2, 9, 46, 1];
// 加密
const encrypt = (str) => {
    const textBytes = aes.utils.utf8.toBytes(str);
    const aesCbc = new aes.ModeOfOperation.cbc(key, iv);
    const encryptedBytes = aesCbc.encrypt(textBytes);
    return aes.utils.hex.fromBytes(encryptedBytes);
}
// 解密
const decrypt = (cryptStr) => {
    const encryptedBytes = aes.utils.hex.toBytes(cryptStr)
    const aesCbc = new aes.ModeOfOperation.cbc(key, iv)
    const decryptedBytes = aesCbc.decrypt(encryptedBytes)
    return aes.utils.utf8.fromBytes(decryptedBytes).match(/[^+]+/)[0]
}
// 使字符串满足加密要求：字符串的字节数必须是16的倍数
const meetEncrypt = (str) => {
    if (typeof str !== 'string' || str.length % 16 === 0) {
        return
    }
    while (str.length % 16) {
        str += '+';
    }
    return str;
}

module.exports = {
    encrypt,
    decrypt,
    meetEncrypt
}