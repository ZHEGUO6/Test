// 建立模型之间的关系
const Admins = require('./admins');
const Comments = require('./comments');
const Friends = require('./friends');
const Groups = require('./groups');
const Messages = require('./messages');
const News = require('./news');
const Searches = require('./searches');
const UnAbled = require('./unabled');
const Users = require('./users');
const SearchImgs = require('./searchImgs');
const CommentReplys = require('./commentReplys');
const { DataTypes } = require('sequelize');

// 一个管理员可以上传多个消息和新闻
Admins.hasMany(Messages, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_Message' });
Admins.hasMany(News, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_News' });

// 一条新闻和消息对应一个管理员
Messages.belongsTo(Admins, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_Message' });
News.belongsTo(Admins, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_News' });
// 一个用户可以有多个朋友，多条搜索信息，多个分组，多个禁用记录，多个回复
Users.hasMany(Friends, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Friends' });
Users.hasMany(Groups, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Groups' });
Users.hasMany(Searches, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Searches' });
Users.hasMany(UnAbled, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_UnAbled' });
Users.hasMany(CommentReplys, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_CommentReply' });

// 一条搜索对应一个用户，对应多图片，有多条评论
Searches.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Searches' });
Searches.hasMany(SearchImgs, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'sId', type: DataTypes.INTEGER }, as: 'search_Images' });
Searches.hasMany(Comments, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'sId', type: DataTypes.INTEGER }, as: 'search_Comments' });

// 一条评论对应一条搜索，对应一个用户，拥有多条回复
Comments.belongsTo(Searches, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'sId', type: DataTypes.STRING(128) }, as: 'search_Comments' });
Comments.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Comments' });


// 一条回复对应一条评论，对应一个用户
CommentReplys.belongsTo(Comments, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'cId', type: DataTypes.INTEGER }, as: 'comment_Reply' });
CommentReplys.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_CommentReply' });

// 一个朋友可以对应两个用户
Friends.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Friends' });
Friends.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'fId', type: DataTypes.STRING(128) }, as: 'user_To_Friends' });
// 一个朋友对应一个分组
Friends.belongsTo(Groups, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'gId', type: DataTypes.INTEGER, defaultValue: 1 }, as: 'friend_Groups' });

// 一个分组对应一个用户
Groups.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Groups' });
// 一个分组对应多个朋友
Groups.hasMany(Friends, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'gId', type: DataTypes.INTEGER, defaultValue: 1 }, as: 'friend_Groups' })

// 一个禁用记录对应一个用户
UnAbled.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_UnAbled' });

// 一个搜索图片对应一个搜索
SearchImgs.belongsTo(Searches, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'sId', type: DataTypes.INTEGER }, as: 'search_Images' });

// 统一设置模型的hooks

// 重置分组id（仅在默认添加到我的好友分组调用，请勿再其他时候调用）
async function resetGroupId(instance) {
    const gId = instance.getDataValue('gId');
    const uId = instance.getDataValue('uId');
    if (gId === 1) {
        // 判断是否仅存在一个分组
        const onlyOne = await Groups.count();
        if (onlyOne !== 1) {
            // 需要定义到默认分组
            // 找到groupId最小的分组，即为我的好友分组
            const myFriendGroupInstance = await Groups.findOne({
                where: {
                    uId
                }
            });
            instance.setDataValue('gId', myFriendGroupInstance.getDataValue('gId'));
        }
    }
};

Admins.addHook('afterDestroy', async (instance, { where: { loginId, ...obj } }) => {
    const opt = {
        where: obj
    };
    if (loginId && loginId.length === 36) {
        opt.where.aId = loginId;
    }
    else {
        // 禁止删除
        return new Error('数据库内部HOOKS错误，请检查传递的数据格式是否有误');
    }
    await Promise.all([Messages.destroy(opt), News.destroy(opt)]);
});

Friends.addHook('afterCreate', async (instance, opt) => {
    //1. 如果是默认分组需要重置为我的好友分组
    //2. 反向定义朋友，并自动划分到我的好友分组，即我的朋友，他的朋友是我
    await resetGroupId(instance);
    const uId = instance.getDataValue('uId');
    const fId = instance.getDataValue('fId');
    const uInstance = await Users.findByPk(fId);
    const fdInstance = await Friends.create({
        uId: fId,
        fId: uId,
        gId: 1,
        note: uInstance.getDataValue('nickname')
    }).catch(err => false);
    if (fdInstance == null || !fdInstance) {
        return new Error('数据库内部HOOKS错误，请检查传递的数据格式是否有误');
    }
    fdInstance && await resetGroupId(fdInstance);
});
Friends.addHook('afterBulkCreate', async (instances) => {
    await Promise.all(instances.map(async i => {
        //1. 如果是默认分组需要重置为我的好友分组
        await resetGroupId(i);
        //2. 反向定义朋友，并自动划分到我的好友分组，即我的朋友，他的朋友是我
        const uId = i.getDataValue('uId');
        const fId = i.getDataValue('fId');
        const uInstance = await Users.findByPk(fId);
        const fdInstance = await Friends.create({
            uId: fId,
            fId: uId,
            gId: 1,
            note: uInstance.getDataValue('nickname')
        }).catch(err => false);
        if (fdInstance == null || !fdInstance) {
            return new Error('数据库内部HOOKS错误，请检查传递的数据格式是否有误');
        }
        fdInstance && await resetGroupId(fdInstance);
    }))
});

Searches.addHook('beforeBulkDestroy', async ({ where: { loginId } }) => {
    const searches = await Searches.findAll({ where: { uId: loginId } }).catch(err => false);
    if (searches) {
        await Promise.all(searches.map(async i => await SearchImgs.destroy({ where: { sId: i.getDataValue('searchId') } })));
    }
});

Users.addHook('afterCreate', async (users, options) => {
    // 创建一个好友分组
    await Groups.create({
        uId: users.getDataValue('loginId'),
        name: '我的好友'
    })
});
Users.addHook('beforeBulkDestroy', async ({ where: { loginId, ...obj } }) => {
    const opt = {
        where: obj
    };
    if (loginId && loginId.length === 36) {
        opt.where.uId = loginId;
    }
    else {
        // 禁止删除
        return Promise.reject(new Error('you must provide loginId to destory'));
    }
    // 1. 寻人交友表删除对应的信息
    // 2. 删除之前的禁用信息
    // 3. 删除分组表中的对应信息
    // 4. 朋友表中删除对应的信息
    // 5. 评论表中删除对应的信息
    await Promise.all([Searches.destroy(opt), UnAbled.destroy(opt), Groups.destroy(opt), Friends.destroy(opt), Comments.destroy(opt)]);
});

module.exports = {
    Admins,
    Comments,
    Friends,
    Groups,
    Messages,
    News,
    Searches,
    UnAbled,
    Users,
    SearchImgs
}