import { defineStore } from 'pinia'
import { getSearchList } from '@/api/search'
import { MessageOptions } from 'naive-ui'

type SearchData = {
  searchList: Array<API.Search.Get>
  searchListTotalCount: number
}

export const useSearchStore = defineStore('search', {
  state: () => {
    const searchData: SearchData = {
      searchList: [],
      searchListTotalCount: 0
    }
    return searchData
  },
  getters: {
    hasSearchList() {
      return this.searchList.length
    }
  },
  actions: {
    //   获取搜索列表
    async fetchSearchList(info: API.SearchPage) {
      const { data, msg } = await getSearchList(info)
      if (data?.datas) {
        this.$patch((state: SearchData) => {
          state.searchList = data.datas
          state.searchListTotalCount = data.count
        })
        return data.datas
      }
      window.$message(`列表数据获取有误${msg ?? ''}`, { type: 'error' } as MessageOptions)
      return []
    }
  }
})
