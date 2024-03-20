import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'
import qs from 'query-string'
import { GD_WEB_API_KEY } from '@/config/env'

declare interface District {
  key: string
  keywords?: string
  subdistrict?: number
  page?: number
  offset?: number
  extensions: 'base' | 'all'
  callback: string
  output: 'JSON' | 'XML'
}

// 高德地图api平台
// 行政区域查询
export const getDistrict = async () => {
  const obj: District = {
    key: GD_WEB_API_KEY,
    keywords: '100000',
    subdistrict: 4
  }
  return request(
    RequestType.GET,
    `https://restapi.amap.com/v3/config/district?${qs.stringify(obj)}`
  )
}

// unisms短信平台
// 找回密码短信验证
export const sentForgetMessage = async (phone: string) => {
  return request(RequestType.POST, RequestUrl.ThirtyPart_ForgetPwd_Message, {
    phone
  })
}
