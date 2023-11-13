//请求路径，axios实例中配置了/api的基路径
export enum RequestUrl {
  Message_GetAll = '/message',
  Message_GetList = '/message/list',
  Message_AddOne = '/message/add',
  Message_AddList = '/message/addList',
  Message_Modify = '/message',
  Message_Delete = '/message',

  User_Modify = '/user',
  User_GetAll = '/user',
  User_GetOne = '/user',
  User_Delete = '/user',
  User_AddOne = '/user/add',
  User_GetList = '/user/list',
  User_Login = '/user/login',
  User_Logout = '/user/logout',
  User_AddList = '/user/addList',
  User_Validate = '/user/validate',
  User_WhoAmI = '/user/login/whoAmI',

  Image_GetInitialAll = '/static/image/all',
  Image_UploadOne = '/api/static/upload/add', // 直接上传

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
