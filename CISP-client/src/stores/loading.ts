import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => {
    return {
      loading: false
    }
  },
  getters: {
    isLoading: (state) => state.loading
  },
  actions: {
    changeLoading(bool: boolean) {
      this.$patch((state) => (state.loading = bool))
      return bool
    }
  }
})
