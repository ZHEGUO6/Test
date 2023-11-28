import { h, render } from 'vue'
import ScreenLoadingIndex from '@/components/ScreenLoading/ScreenLoadingIndex.vue'

export default (el: any, binding: any) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  if (binding.value) {
    //   开启动画
    render(h(ScreenLoadingIndex, { show: binding.value }), el)
    return
  }
  // 关闭动画
  render(h(ScreenLoadingIndex, { show: binding.value }), el)
}
