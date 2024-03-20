import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 获取所有的系统自带头像
export const getAllInitialAvatar = async () => {
  return request(RequestType.GET, RequestUrl.Image_GetInitialAll)
}

// 上传一张图片
export const upload = async () => {
  return request(RequestType.POST, RequestUrl.Image_UploadOne)
}
