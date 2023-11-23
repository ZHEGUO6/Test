import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 获取新闻总数
export const getNewsCount = async () => {
  return await request(RequestType.GET, RequestUrl.News_GetCount)
}

// 分页获取新闻
export const getList = async (info: API.SearchPage) => {
  return await request(RequestType.GET, RequestUrl.News_GetList + `?${qs.stringify(info)}`)
}

// 分页获取重要新闻
export const getImportantList = async (info: API.SearchPage) => {
  return await request(
    RequestType.GET,
    RequestUrl.News_GetListByImportant + `?${qs.stringify(info)}`
  )
}

// 获取重要新闻的数量
export const getImportantCount = async () => {
  return await request(RequestType.GET, RequestUrl.News_GetImportantCount)
}

// 获取指定新闻
export const getOne = async (id: number) => {
  return await request(RequestType.GET, RequestUrl.News_GetOne + `/${id}`)
}

// 增加新闻浏览数量
export const increaseScanNum = async (info: API.News.ModifyCount) => {
  return await request(RequestType.PUT, RequestUrl.News_ModifyCount, info)
}
