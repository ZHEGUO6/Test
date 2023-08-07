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
const { DataTypes } = require('sequelize')

// 一个管理员可以上传多个消息和新闻
Admins.hasMany(Messages, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_Message' });
Admins.hasMany(News, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_News' });

// 一条新闻和消息对应一个管理员
Messages.belongsTo(Admins, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_Message' });
News.belongsTo(Admins, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'aId', type: DataTypes.STRING(128) }, as: 'admin_News' });

// 一个用户可以有多条评论，多个朋友，多条搜索信息，多个分组，多个禁用记录，多个回复
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
Friends.belongsTo(Groups, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'gId', type: DataTypes.INTEGER }, as: 'friend_Groups' });

// 一个分组对应一个用户
Groups.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_Groups' });
// 一个分组对应多个朋友
Groups.hasMany(Friends, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'gId', type: DataTypes.INTEGER }, as: 'friend_Groups' })

// 一个禁用记录对应一个用户
UnAbled.belongsTo(Users, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'uId', type: DataTypes.STRING(128) }, as: 'user_UnAbled' });

// 一个搜索图片对应一个搜索
SearchImgs.belongsTo(Searches, { foreignKeyConstraint: true, foreignKey: { allowNull: false, name: 'sId', type: DataTypes.INTEGER }, as: 'search_Images' })
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