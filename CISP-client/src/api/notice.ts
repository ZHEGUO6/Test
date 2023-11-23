import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 获取公告总数
export const getNoticeCount = async () => {
  return await request(RequestType.GET, RequestUrl.Notice_GetCount)
}

// 分页获取公告
export const getList = async (info: API.SearchPage) => {
  return await request(RequestType.GET, RequestUrl.Notice_GetList + `?${qs.stringify(info)}`)
}

// 分页获取重要公告
export const getImportantList = async (info: API.SearchPage) => {
  return await request(
    RequestType.GET,
    RequestUrl.Notice_GetListByImportant + `?${qs.stringify(info)}`
  )
}

// 获取重要公告的数量
export const getImportantCount = async () => {
  return await request(RequestType.GET, RequestUrl.Notice_GetImportantCount)
}

// 获取指定公告
export const getOne = async (id: number) => {
  return await request(RequestType.GET, RequestUrl.Notice_GetOne + `/${id}`)
}

// 增加公告浏览数量
export const increaseScanNum = async (info: API.Notice.ModifyCount) => {
  return await request(RequestType.PUT, RequestUrl.Notice_ModifyCount, info)
}
