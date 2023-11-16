// 建立模型之间的关系
const Admin = require("./admin");
const Comment = require("./comment");
const Friend = require("./friend");
const Group = require("./group");
const Notice = require("./notice");
const Message = require("./message");
const New = require("./new");
const NewImg = require("./newImg");
const Search = require("./search");
const UnAble = require("./unable");
const User = require("./user");
const SearchImg = require("./searchImg");
const CommentReply = require("./commentReply");
const { DataTypes } = require("sequelize");
const Unable = require("./unable");
const { catchError } = require("../utils/server");
const inspector = require("inspector");
const Comments = require("./comment");

// 一个管理员可以发送多条公告、新闻
Admin.hasMany(Notice, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "aId", type: DataTypes.STRING(128) },
  as: "admin_Notice",
});
Admin.hasMany(New, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "aId", type: DataTypes.STRING(128) },
  as: "admin_New",
});

// 一条新闻、消息、公告对应一个管理员
Notice.belongsTo(Admin, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "aId", type: DataTypes.STRING(128) },
  as: "admin_Notice",
});

New.hasMany(NewImg, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "nId", type: DataTypes.INTEGER },
  as: "new_NewImg",
});
New.belongsTo(Admin, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "aId", type: DataTypes.STRING(128) },
  as: "admin_New",
});

NewImg.belongsTo(New, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "nId", type: DataTypes.INTEGER },
  as: "new_NewImg",
});

// 一个用户可以有多个朋友，多条搜索信息，多个分组，多个禁用记录，多个回复，多个消息
User.hasMany(Friend, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Friend",
});
User.hasMany(Group, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Group",
});
User.hasMany(Search, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Search",
});
User.hasMany(UnAble, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_UnAble",
});
User.hasMany(CommentReply, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_CommentReply",
});
User.hasMany(Message, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Message",
});

Message.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Message",
});

// 一条搜索对应一个用户，对应多图片，有多条评论
Search.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Search",
});
Search.hasMany(SearchImg, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "sId", type: DataTypes.INTEGER },
  as: "search_SearchImg",
});
Search.hasMany(Comment, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "sId", type: DataTypes.INTEGER },
  as: "search_Comment",
});

// 一条评论对应一条搜索，对应一个用户，拥有多条回复
Comment.belongsTo(Search, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "sId", type: DataTypes.STRING(128) },
  as: "search_Comment",
});
Comment.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Comment",
});

// 一条回复对应一条评论，对应一个用户
CommentReply.belongsTo(Comment, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "cId", type: DataTypes.INTEGER },
  as: "comment_Reply",
});
CommentReply.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_CommentReply",
});

// 一个朋友可以对应两个用户
Friend.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Friend",
});
Friend.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "fId", type: DataTypes.STRING(128) },
  as: "user_To_Friend",
});
// 一个朋友对应一个分组
Friend.belongsTo(Group, {
  foreignKeyConstraint: true,
  foreignKey: {
    allowNull: false,
    name: "gId",
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  as: "friend_Group",
});

// 一个分组对应一个用户
Group.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_Group",
});
// 一个分组对应多个朋友
Group.hasMany(Friend, {
  foreignKeyConstraint: true,
  foreignKey: {
    allowNull: false,
    name: "gId",
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  as: "friend_Group",
});

// 一个禁用记录对应一个用户
UnAble.belongsTo(User, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "uId", type: DataTypes.STRING(128) },
  as: "user_UnAble",
});

// 一个搜索图片对应一个搜索
SearchImg.belongsTo(Search, {
  foreignKeyConstraint: true,
  foreignKey: { allowNull: false, name: "sId", type: DataTypes.INTEGER },
  as: "search_SearchImg",
});

// 统一设置模型的hooks

// 重置分组id（仅在默认添加到我的好友分组调用，请勿再其他时候调用）
async function resetGroupId(instance) {
  const gId = instance.getDataValue("gId");
  const uId = instance.getDataValue("uId");
  if (gId === 1) {
    // 判断是否仅存在一个分组
    const onlyOne = await Group.count();
    if (onlyOne !== 1) {
      // 需要定义到默认分组
      // 找到groupId最小的分组，即为我的好友分组
      const myFriendGroupInstance = await Group.findOne({
        where: {
          uId,
        },
      });
      instance.setDataValue("gId", myFriendGroupInstance.getDataValue("gId"));
    }
  }
}

// 统一设置模型的hooks

User.addHook("afterCreate", async (user, options) => {
  // 创建一个好友分组
  await Group.create({
    uId: user.getDataValue("loginId"),
    name: "我的好友",
    initial: true,
  });
});

User.addHook("beforeDestroy", async (instance, { where: { loginId } }) => {
  const opt = {
    where: {
      uId: loginId,
    },
  }; // 通用属性

  // 需要调用模型的before/after destroy方法
  const needIndividualOpt = {
    ...opt,
    individualHooks: true,
  };
  // 1. 搜寻表删除对应的信息
  // 2. 删除之前的禁用信息
  // 3. 删除分组表中的对应信息
  // 3. 删除消息表中的对应信息
  await Promise.all([
    Search.destroy(needIndividualOpt),
    UnAble.destroy(opt),
    Group.destroy(needIndividualOpt),
    Message.destroy(opt),
  ]);
});

Search.addHook("beforeDestroy", async (search) => {
  // 1. 搜寻图片表删除对应的信息
  // 2. 搜寻评论表删除之前的禁用信息
  const sId = search.getDataValue("searchId");
  await SearchImg.destroy({
    where: { sId },
  });
  await Comment.destroy({
    where: {
      sId,
    },
    individualHooks: true,
  });
});

Group.addHook(
  "beforeDestroy",
  async (instance, { where: { uId, groupId } }) => {
    if (!groupId) {
      // 删除用户信息
      //   朋友表删除对应的信息
      await Friend.destroy({
        where: {
          uId,
          gId: instance.getDataValue("groupId"),
        },
      });
      return;
    } // 删除当前分组信息
    if (instance.getDataValue("initial")) {
      //   当前是初始分组，禁止删除
      throw new Error("无法删除初始分组信息");
    }
    const initialGroup = await Group.findOne({
      where: {
        uId,
        initial: true,
      },
    });
    // 将当前的朋友分组信息更改到初始分组中
    await Friend.update(
      {
        gId: initialGroup.getDataValue("groupId"),
      },
      {
        where: {
          gId: groupId,
          uId,
        },
      }
    );
  }
);

Comment.addHook("beforeDestroy", async (instance) => {
  const opt = {
    where: {
      cId: instance.getDataValue("commentId"),
    },
  };
  // 1. 评论回复表删除对应的信息
  await CommentReply.destroy(opt);
});

CommentReply.addHook("beforeCreate", async (instance) => {
  const cInstance = await Comments.findByPk(instance.getDataValue("cId"));
  if (cInstance?.getDataValue("uId") === instance.getDataValue("uId")) {
    // 不能自己给自己回复
    throw new Error("仅允许他人给自己回复，请勿自回");
  }
});

Admin.addHook("afterDestroy", async (instance, { where: { loginId } }) => {
  const opt = {
    where: {
      aId: loginId,
    },
  };
  await Promise.all([
    Notice.destroy(opt),
    New.destroy({
      ...opt,
      individualHooks: true,
    }),
  ]);
});

New.addHook(
  "beforeDestroy",
  async (instance) =>
    await NewImg.destroy({
      where: {
        nId: instance.getDataValue("newId"),
      },
    })
);

const createFriend = async (instance) => {
  //1. 如果是默认分组需要重置为我的好友分组
  //2. 反向定义朋友，并自动划分到我的好友分组，即我的朋友，他的朋友是我
  await resetGroupId(instance);
  const uId = instance.getDataValue("uId");
  const fId = instance.getDataValue("fId");
  const uInstance = await User.findByPk(fId);
  const fdInstance = await Friend.create({
    uId: fId,
    fId: uId,
    gId: 1,
    note: uInstance.getDataValue("nickname"),
  }).catch((err) => false);
  if (fdInstance == null || !fdInstance) {
    return new Error("数据库内部HOOKS错误，请检查传递的数据格式是否有误");
  }
  fdInstance && (await resetGroupId(fdInstance));
};

Friend.addHook("beforeCreate", async (instance, opt) => {
  const has = await Friend.findOne({
    where: {
      uId: instance.getDataValue("uId"),
      fId: instance.getDataValue("fId"),
    },
  });
  if (has) {
    throw new Error("该朋友已经存在，请勿多次添加");
  }
  await createFriend(instance);
});

UnAble.addHook("beforeCreate", async (instance) => {
  // 判断是否已经有禁用记录了
  const has = await Unable.findOne({
    where: {
      uId: item.uId,
    },
  });
  if (has) {
    throw new Error("该用户已经被禁用了，无法多次禁用");
  }
  // 禁用添加记录的用户
  await User.update(
    {
      enabled: false,
    },
    {
      where: {
        loginId: instance.getDataValue("uId"),
      },
    }
  );
});

UnAble.addHook("beforeDestroy", async (instance) => {
  // 更新用户禁用信息
  await User.update(
    { enabled: true },
    {
      where: {
        loginId: instance.getDataValue("uId"),
      },
    }
  );
});

module.exports = {
  Admin,
  Comment,
  Friend,
  Group,
  Notice,
  Message,
  New,
  Search,
  UnAble,
  User,
  SearchImg,
  CommentReply,
};
