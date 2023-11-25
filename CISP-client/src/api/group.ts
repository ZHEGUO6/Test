import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 获取指定分组
export const getOneGroup = async (id: number) => {
  return await request(RequestType.GET, RequestUrl.Group_GetOne + `/${id}`)
}

// 获取指定用户的所有分组
export const getGroupListByUser = async (uId: string) => {
  return await request(RequestType.GET, RequestUrl.Group_GetAllByUser + `/${uId}`)
}

// 新增分组
export const addGroup = async (info: API.Group.Add) => {
  return await request(RequestType.POST, RequestUrl.Group_Add, info)
}

// 新增多条分组
export const addGroupList = async (info: API.Group.Add) => {
  return await request(RequestType.POST, RequestUrl.Group_AddList, info)
}

// 修改指定分组
export const modifyGroup = async (id: number, info: API.Group.Modify) => {
  return await request(RequestType.PUT, RequestUrl.Group_Modify + `/${id}`, info)
}

// 删除某一用户的分组
export const deleteGroup = async (id: number, uId: string) => {
  return await request(RequestType.DELETE, RequestUrl.Group_DeleteByUser + `/${id}/${uId}`)
}
