import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 根据当前用户分页查找满足要求的朋友
export const findMeetFriends = async (id: string, info: API.SearchPage) => {
  return request(RequestType.GET, RequestUrl.User_FindMeetFriends, info)
}

// 验证昵称密码是否正确
export const validate = async (info: API.User.ValidateLogin) => {
  return request(RequestType.POST, RequestUrl.User_Validate, info)
}

// 用户登录
export const login = async (info: API.User.Login) => {
  return request(RequestType.POST, RequestUrl.User_Login, info)
}

// 获取指定用户
export const getSingle = async (info: API.User.FindOne) => {
  return request(RequestType.POST, RequestUrl.User_GetOne, info)
}

// 用户恢复登录
export const whoAmI = async () => {
  return request(RequestType.GET, RequestUrl.User_WhoAmI)
}

// 用户退出登录
export const loginOut = async () => {
  return request(RequestType.GET, RequestUrl.User_Logout)
}

// 修改用户信息
export const modify = async (id: string, info: API.User.Modify) => {
  return request(RequestType.PUT, `${RequestUrl.User_Modify}/${id}`, info)
}

// 用户注册
export const registry = async (info: API.User.Add) => {
  return request(RequestType.POST, RequestUrl.User_AddOne, info)
}

// 用户注销
export const off = async (id: string) => {
  return request(RequestType.DELETE, `${RequestUrl.User_Delete}/${id}`)
}
