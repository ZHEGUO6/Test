import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 验证昵称密码是否正确
export const validate = async (info: API.User.ValidateLogin) => {
  return await request(RequestType.POST, RequestUrl.User_Validate, info)
}

// 用户登录
export const login = async (info: API.User.Login) => {
  return await request(RequestType.POST, RequestUrl.User_Login, info)
}

// 用户恢复登录
export const whoAmI = async () => {
  return await request(RequestType.GET, RequestUrl.User_WhoAmI)
}

// 用户退出登录
export const loginOut = async () => {
  return await request(RequestType.POST, RequestUrl.User_Logout)
}

// 修改用户信息
export const modify = async (id: string, info: API.User.Modify) => {
  return await request(RequestType.PUT, RequestUrl.User_Modify + `/${id}`, info)
}

// export const
