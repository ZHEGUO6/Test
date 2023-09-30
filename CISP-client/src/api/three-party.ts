import request from './request'
import { RequestType } from '@/types/enum'
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

// 行政区域查询
export const getDistrict = async () => {
  const obj: District = {
    key: GD_WEB_API_KEY,
    keywords: '100000',
    subdistrict: 4
  }
  return await request(
    RequestType.GET,
    `https://restapi.amap.com/v3/config/district?${qs.stringify(obj)}`
  )
}
