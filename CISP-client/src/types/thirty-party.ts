// 高德开放平台

// 行政区域查询
export declare interface GD_WEB_API_DISTRICT {
  citycode: string[]
  adcode: string
  name: string
  polyline?: string
  center: string
  level: string
  districts: GD_WEB_API_DISTRICT[]
}
