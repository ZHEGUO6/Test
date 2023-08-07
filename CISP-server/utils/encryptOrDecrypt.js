const aes = require('aes-js');
const key = (Date.now().toString(10) + Math.random().toString(8).slice(3, 6)).split('').map(i => Number(i));

// The initialization vector (must be 16 bytes)
const iv = (Date.now().toString(10) + Math.random().toString(8).slice(3, 6)).split('').map(i => Number(i));
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
    return aes.utils.utf8.fromBytes(decryptedBytes)
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