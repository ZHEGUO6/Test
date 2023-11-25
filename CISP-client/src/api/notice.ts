import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 获取公告总数
export const getNoticeCount = async () => {
  return await request(RequestType.GET, RequestUrl.Notice_GetCount)
}

// 分页获取公告
export const getNoticeList = async (info: API.SearchPage) => {
  return await request(RequestType.GET, RequestUrl.Notice_GetList + `?${qs.stringify(info)}`)
}

// 分页获取重要公告
export const getNoticeImportantList = async (info: API.SearchPage) => {
  return await request(
    RequestType.GET,
    RequestUrl.Notice_GetListByImportant + `?${qs.stringify(info)}`
  )
}

// 获取指定公告
export const getOneNotice = async (id: number) => {
  return await request(RequestType.GET, RequestUrl.Notice_GetOne + `/${id}`)
}

// 增加公告浏览数量
export const increaseNoticeScanNum = async (info: API.Notice.ModifyCount) => {
  return await request(RequestType.PUT, RequestUrl.Notice_ModifyCount, info)
}
