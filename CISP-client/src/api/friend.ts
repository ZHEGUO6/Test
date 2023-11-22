import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 获取某一用户的所有朋友数量
export const getFriendCount = async () => {
  return await request(RequestType.GET, RequestUrl.Friend_GetCountByUser)
}

// 分页获取某一用户某一分组的朋友
export const getFriendList = async (uId: string, gId: number, info: API.SearchPage) => {
  return await request(
    RequestType.GET,
    RequestUrl.Friend_GetListByUser + `/${uId}/${gId}?${qs.stringify(info)}`
  )
}

// 新增朋友
export const addFriend = async (info: API.Friend.Add) => {
  return await request(RequestType.POST, RequestUrl.Friend_Add, info)
}

// 修改朋友
export const modifyFriend = async (id: number, info: API.Friend.Modify) => {
  return await request(RequestType.PUT, RequestUrl.Friend_Modify + `/${id}`, info)
}

// 删除朋友
export const deleteFriend = async (id: number) => {
  return await request(RequestType.DELETE, RequestUrl.Friend_Delete + `/${id}`)
}
