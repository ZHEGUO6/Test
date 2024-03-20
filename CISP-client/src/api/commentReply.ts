import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 新增单条评论回复
export const addCommentReply = async (info: API.Comment.Add) => {
  return request(RequestType.POST, RequestUrl.CommentReply_Add, info)
}
