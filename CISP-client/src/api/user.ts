import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 验证昵称密码是否正确
export const validate = async (info: API.User.ValidateLogin) => {
  return await request(RequestType.POST, RequestUrl.User_Validate, info)
}

// 用户登录
export const login = async (info: API.User.Login) => {
  return await request(RequestType.POST, RequestUrl.User_Login, info)
}

// 获取全部用户
export const getAll = async (id: string) => {
  return await request(RequestType.GET, RequestUrl.User_GetAll)
}

// 分页获取用户
export const getListByPage = async (query: API.User.Find) => {
  return await request(RequestType.GET, `${RequestUrl.User_GetList}?${qs.stringify(info)}`)
}

// 获取指定用户
export const getSingle = async (id: string) => {
  return await request(RequestType.GET, `${RequestUrl.User_GetOne}/${id}`)
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
  return await request(RequestType.PUT, `${RequestUrl.User_Modify}/${id}`, info)
}

// 用户注册
export const registry = async (info: API.User.Add) => {
  return await request(RequestType.POST, RequestUrl.User_AddOne, info)
}

// 用户注销
export const off = async (id: string) => {
  return await request(RequestType.DELETE, `${RequestUrl.User_Delete}/${id}`)
}
