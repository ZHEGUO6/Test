//请求路径，axios实例中配置了/api的基路径
export enum requestUrl {
  user_validate = '/user/validate',
  user_login = '/user/login',
  user_logout = '/user/logout',
  user_whoamI = '/user/login/whoamI'
}

//请求类型
export enum requestType {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
  patch = 'patch'
}
