import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 获取搜寻总数
export const getSearchCount = async () => {
  return await request(RequestType.GET, RequestUrl.Search_GetCount)
}

// 分页获取搜寻
export const getSearchList = async (info: API.SearchPage) => {
  return await request(RequestType.GET, RequestUrl.Search_GetList + `?${qs.stringify(info)}`)
}

// 根据类型分页获取搜寻
export const getSearchListByType = async (typeId: number, info: API.SearchPage) => {
  return await request(
    RequestType.GET,
    RequestUrl.Search_GetListByType + `/${typeId}?${qs.stringify(info)}`
  )
}

// 根据类型获取搜寻的数量
export const getSearchCountByType = async (typeId: number) => {
  return await request(RequestType.GET, RequestUrl.Search_GetCountByType + `/${typeId}`)
}

// 获取指定搜寻
export const getOneSearch = async (id: number) => {
  return await request(RequestType.GET, RequestUrl.Search_GetOne + `/${id}`)
}

// 新增搜寻
export const addSearch = async () => {
  return await request(RequestType.POST, RequestUrl.Search_Add)
}

// 增加搜寻评论、浏览数量
export const increaseSearchNum = async (info: API.Search.ModifyCount) => {
  return await request(RequestType.PUT, RequestUrl.Search_ModifyNum, info)
}

// 删除搜寻
export const deleteSearch = async (id: number) => {
  return await request(RequestType.DELETE, RequestUrl.Search_Delete + `/${id}`)
}
