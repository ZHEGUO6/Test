import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'

// 分页获取指定搜寻下的评论
export const getCommentListBySearch = async (id: number, info: API.SearchPage) => {
  return request(
    RequestType.GET,
    RequestUrl.Comment_GetListBySearch + `/${id}?${qs.stringify(info)}`
  )
}

// 新增单条评论
export const addComment = async (info: API.Comment.Add) => {
  return request(RequestType.POST, RequestUrl.Comment_Add, info)
}
