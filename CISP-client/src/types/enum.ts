//请求路径，axios实例中配置了/api的基路径
export enum RequestUrl {
  Message_GetOne = '/message/getOne', // 获取指定消息
  Message_GetList = '/message/list', // 分页获取某一用户的消息
  Message_AddOne = '/message/add', // 添加单条消息
  Message_AddList = '/message/addList', // 添加多条消息
  Message_Modify = '/message', // 修改指定消息
  Message_Delete = '/message', // 删除一条消息

  User_Modify = '/user', // 修改用户
  User_Count = '/user/count', // 获取用户数量
  User_GetOne = '/user', // 获取单个用户
  User_Delete = '/user', // 删除用户
  User_AddOne = '/user/add', // 添加单个用户
  User_FindMeetFriends = '/user/find/friendList', // 根据当前用户分页查找满足要求的朋友
  User_FindMeetUsers = '/user/find/list', // 分页查找满足要求的用户
  User_GetList = '/user/list', // 分页获取用户
  User_Login = '/user/login', // 用户登录
  User_Logout = '/user/logout', // 退出登录
  User_AddList = '/user/addList', // 添加多个用户
  User_Validate = '/user/validate', // 验证账号密码是否正确
  User_WhoAmI = '/user/login/whoAmI', // 恢复登录

  Search_GetCount = '/search/count', // 获取所有搜寻的数量
  Search_GetCountByType = '/search/type/count', // 根据类型获取对应数量
  Search_GetList = '/search/list', // 分页获取搜寻信息
  Search_GetListByType = '/search/list/type', // 根据类型分页获取搜寻信息
  Search_GetOne = '/search', // 根据类型分页获取搜寻信息
  Search_Add = '/search/add', // 新增搜寻信息
  Search_ModifyNum = '/search/increase', // 增加评论或浏览数量
  Search_Delete = '/search', // 删除搜寻信息

  SearchImg_Add = '/searchImg/add', // 新增单个搜寻图片
  SearchImg_AddList = '/searchImg/add', // 新增多个搜寻图片
  SearchImg_Delete = '/searchImg', // 删除指定搜寻图片

  Comment_GetList = '/comment/list', // 分页获取评论
  Comment_GetListBySearch = '/comment/search/list', // 分页获取指定搜寻下的所有评论
  Comment_GetOne = '/comment', // 获取单条评论
  Comment_Add = '/comment/add', // 新增单条评论
  Comment_Modify = '/comment', // 修改指定评论
  Comment_Delete = '/comment', // 删除指定评论

  CommentReply_GetListByComment = '/commentReply/list', // 分页获取某一评论下的评论回复
  CommentReply_GetOne = '/commentReply', // 获取单个评论回复
  CommentReply_Add = '/commentReply/add', // 新增单条评论回复
  CommentReply_Modify = '/commentReply', // 修改指定评论回复
  CommentReply_Delete = '/commentReply', // 删除指定评论回复

  Unable_GetCount = '/unable/count', // 获取所有禁用记录数量
  Unable_GetListByUser = '/unable/list', // 分页获取某一用户的禁用记录
  Unable_GetList = '/unable/list', // 分页获取禁用记录
  Unable_GetOne = '/unable', // 获取指定禁用记录
  Unable_Add = '/unable/add', // 新增禁用记录
  Unable_Delete = '/unable', // 删除禁用记录

  Friend_GetCountByUser = '/friend/count', // 获取某一用户的所有朋友
  Friend_GetListByUser = '/friend/list', // 获取某一用户某一分组的所有朋友
  Friend_Add = '/friend/add', // 新增单条朋友消息
  Friend_Modify = '/friend', // 修改单条朋友消息
  Friend_Delete = '/friend', // 删除单条朋友消息

  Group_GetAllByUser = '/group/list', // 获取指定用户的所有分组
  Group_GetOne = '/group', // 获取指定分组
  Group_Add = '/group/add', // 新增单个分组
  Group_AddList = '/group/addList', // 新增多个分组
  Group_Modify = '/group', // 修改单个分组
  Group_DeleteByUser = '/group', // 删除某一用户的某个分组

  Notice_GetCount = '/notice/count', // 获取公告数量
  Notice_GetImportantCount = '/notice/count/important', // 获取重要公告数量
  Notice_GetList = '/notice/list', // 分页获取公告
  Notice_GetListByImportant = '/notice/list/important', // 分页获取重要公告
  Notice_GetOne = '/notice/getOne', // 获取单个公告
  Notice_Add = '/notice/add', // 新增单个公告
  Notice_AddList = '/notice/addList', // 新增多个公告
  Notice_Modify = '/notice', // 修改单个公告
  Notice_ModifyCount = '/notice/increase', // 增加浏览数量
  Notice_Delete = '/notice', // 删除单个公告

  News_GetCount = '/news/count', // 获取新闻总数
  News_GetList = '/news/list', // 分页获取新闻
  News_GetImportantCount = '/news/count/important', // 获取重要新闻的数量
  News_GetListByImportant = '/news/list/important', // 分页获取重要新闻
  News_GetOne = '/news/getOne', // 获取指定新闻
  News_Add = '/news/add', // 新增单条新闻
  News_Modify = '/news', // 修改单条新闻
  News_ModifyCount = '/news/increase', // 增加浏览数量
  News_Delete = '/news', // 删除单条新闻

  NewsImg_Add = '/newsImg/add', // 新增单条新闻图片
  NewsImg_AddList = '/newsImg/addList', // 新增多条新闻图片
  NewsImg_Delete = '/newsImg', // 删除新闻图片

  Image_GetInitialAll = '/static/image/all', // 获取所有头像
  Image_UploadOne = '/api/static/upload/add', // 上传用户头像

  Captcha_Get = '/captcha',
  Captcha_Validate = '/captcha/validate',

  ThirtyPart_ForgetPwd_Message = '/thirtyPart/sentMessage/forgetPwd'
}

//请求类型
export enum RequestType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch'
}

// 验证登录表单相关表单项
export enum ValidateLoginEnum {
  NickName = 'nickname',
  LoginPwd = 'loginPwd',
  SaveTime = 'saveTime',
  Captcha = 'captcha'
}

// 验证注册表单相关表单项
export enum ValidateRegistryEnum {
  NickName = 'nickname',
  LoginPwd = 'loginPwd',
  ConfirmPwd = 'confirmPwd',
  Avatar = 'avatar',
  Mail = 'mail',
  QQ = 'qq',
  Wechat = 'wechat',
  Intro = 'intro',
  Type = 'type',
  Address = 'addr',
  Phone = 'phone',
  BirthDay = 'birthDay',
  SaveTime = 'saveTime',
  Captcha = 'captcha',
  Enabled = 'enabled',
  LastLoginTime = 'lastLoginDate',
  LoginId = 'loginId',
  Online = 'online'
}

// 本地存储空间 key
export enum LocalStorageItemName {
  LoginAndRegistryPageType = 'loginAndRegistryPageType' // 当前为登录表单还是注册表单 registry / login
}

// 会话存储空间 key
export enum SessionStorageItemName {
  GdWebApiDistrict = 'GD-WEB-API-District', // 高德地图api行政区域查询
  RegistryCaptchaValidateTime = 'registryCaptchaValidateTime', // 登录表单验证码验证剩余时间
  LoginCaptchaValidateTime = 'loginCaptchaValidateTime', // 登录表单验证码验证剩余时间
  RegistryCaptcha = 'registryCaptcha', // 注册表单验证码
  LoginCaptcha = 'loginCaptcha', // 登录表单验证码
  InitialAvatarLinks = 'initialAvatars', // 系统初始头像links
  ForgetPwdCaptchaValidateTime = 'forgetPwdCaptchaValidateTime', // 找回密码表单验证码剩余时间
  User = 'user' //  当前的用户信息
}
