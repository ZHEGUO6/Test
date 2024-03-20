import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 新增搜寻图片
export const addSearchImg = async () => {
  return request(RequestType.POST, RequestUrl.SearchImg_Add)
}

// 新增多张搜寻图片
export const addSearchImgList = async () => {
  return request(RequestType.POST, RequestUrl.SearchImg_AddList)
}

// 删除搜寻图片
export const deleteSearchImg = async (id: number) => {
  return request(RequestType.DELETE, RequestUrl.SearchImg_Delete + `/${id}`)
}
