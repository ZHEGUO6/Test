import { reactive } from 'vue'
import useDefaults from '@/hooks/useDefaults'

export interface PageInfo {
  page: number
  limit: number
  total: number
}

export default (props?: Partial<PageInfo>) => {
  const pageInfo = reactive(
    useDefaults(props ?? {}, {
      page: 1,
      limit: 10
    })
  ) as unknown as PageInfo

  const updatePageInfo = (obj: Partial<PageInfo>) => {
    for (const objKey in obj) {
      // @ts-ignore
      pageInfo[objKey] = obj[objKey]
    }
  }
  return {
    pageInfo,
    updatePageInfo
  }
}
