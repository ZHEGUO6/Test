// const { Users, Admins, Comments, Friends, Groups, Messages, News, Searches, UnAbled, SearchImgs } = require('./models');
const express = require('express');
const sequelize = require('./sequelize');
// 对数据库进行测试
// (async () => {
//     // await Users.create({
//     //     loginId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1s',
//     //     loginPwd: '123asasd@',
//     //     avatar: 'http://www.baidu.com',
//     //     nickname: '测试昵称',
//     //     mail: "2425412768@qq.com",
//     //     qq: '2423115759',
//     //     wechat: 'wanchensd21',
//     //     intro: 'sadas',
//     //     registerDate: Date.now(),
//     //     lastLoginDate: Date.now(),
//     //     enabled: 0,
//     //     type: 'student',
//     //     addr: '516512-213121-1561',
//     //     phone: '15123181654',
//     //     online: 'online-5g',
//     //     birthDay: Date.now(),
//     // });
//     // await Users.create({
//     //     loginId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd13',
//     //     loginPwd: '123asasd@',
//     //     avatar: 'http://www.baidu.com',
//     //     nickname: '测试昵称',
//     //     mail: "2425412768@qq.com",
//     //     qq: '2423115759',
//     //     wechat: 'wanchensd21',
//     //     intro: 'sadas',
//     //     registerDate: Date.now(),
//     //     lastLoginDate: Date.now(),
//     //     enabled: 0,
//     //     type: 'student',
//     //     addr: '516512-213121-1561',
//     //     phone: '15123181654',
//     //     online: 'online-5g',
//     //     birthDay: Date.now(),
//     // })
//     // await Admins.create({
//     //     loginId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1a', loginPwd: '123sadad@', avatar: 'http://www.baidu.com',
//     //     nickname: '测试昵称',
//     //     enabled: 0
//     // });
//     // await Friends.create({ uId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1s', fId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd13', gId: 1 });
//     // await Messages.create({ title: '测试消息', content: '哈哈哈哈哈哈哈哈哈哈哈哈哈12313213212312313', aId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1a' });
//     // await News.create({ title: '新闻测试标题', content: '新闻新闻wwwwwwwwwwwwwwwwwwwwwwww021', aId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1a' });
//     // await Searches.create({ title: '我想中啊湿', intro: '测试测试saddas21ds3d1a32d1d23da1d32s1da32d1as23d', enabled: 0, uId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1s' });
//     // await Searches.create({ title: '我想中啊湿', intro: '测试测试saddas21ds3d1a32d1d23da1d32s1da32d1as23d', enabled: 0, uId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd13', commentNumber: 10, scanNumber: 5 });
//     // await SearchImgs.create({ imgUrl: 'https://www.baidu.com/link?url=yPYB-sE1RZgYqlQU6epE36GxWVFtw6SrwBKfAht6VlKBFqrq60OP', sId: 1 });
//     // await Comments.create({ content: '测试评论', uId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1s', toUid: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd13' });
//     // await UnAbled.create({ unAccessMsg: '用户无法登录', uId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd13' });
//     // await Admins.destroy({
//     //     where: {
//     //         loginId: 'a9c1942a-2ee4-11ee-ad02-cf3d6326sd1a'
//     //     }
//     // })
//     // await Users.destroy({
//     //     where: {
//     //         loginId: "a9c1942a-2ee4-11ee-ad02-cf3d6326sd1s"
//     //     }
//     // })
// })()
const app = express();
module.exports = app