import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 获取指定消息
export const getOneMessage = async (id: number) => {
  return await request(RequestType.GET, RequestUrl.Message_GetOne + `/${id}`)
}

// 分页获取某一用户的消息
export const getMessageListByUser = async (uId: string, info: API.SearchPage) => {
  return await request(
    RequestType.GET,
    RequestUrl.Message_GetList + `/${uId}?${qs.stringify(info)}`
  )
}

// 新增消息
export const addMessage = async (info: API.Message.Add) => {
  return await request(RequestType.POST, RequestUrl.Message_AddOne, info)
}

// 新增多条消息
export const addMessageList = async (info: API.Message.Add) => {
  return await request(RequestType.POST, RequestUrl.Message_AddList, info)
}

// 修改指定消息
export const modifyMessage = async (id: number, info: API.Message.Modify) => {
  return await request(RequestType.PUT, RequestUrl.Message_Modify + `/${id}`, info)
}

// 删除某一用户的消息
export const deleteMessage = async (id: number) => {
  return await request(RequestType.DELETE, RequestUrl.Message_Delete + `/${id}`)
}
