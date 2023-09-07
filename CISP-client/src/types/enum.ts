//请求路径，axios实例中配置了/api的基路径
export enum RequestUrl {
  User_Modify='/user',
  User_GetAll='/user',
  User_GetOne='/user',
  User_Delete='/user',
  User_AddOne='/user/add',
  User_GetList='/user/list',
  User_Login = '/user/login',
  User_Logout = '/user/logout',
  User_AddList='/user/addList',
  User_Validate = '/user/validate',
  User_WhoAmI = '/user/login/whoAmI',

  Captcha_Get='/captcha',
  Captcha_Validate='/captcha/validate',
}

//请求类型
export enum RequestType {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch'
}

export enum  ValidateLoginEnum{
  NickName='nickname',
  LoginPwd='loginPwd',
  SaveTime='saveTime',
  Captcha='captcha'
}
