<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import { NScrollbar, ScrollbarInst } from 'naive-ui'

const props = withDefaults(
  defineProps<{
    maxWidth: string
    initialWidth?: string
  }>(),
  {
    maxWidth: '400px',
    initialWidth: 'calc(100vw - 272px)'
  }
)

const { maxWidth, initialWidth } = toRefs(props)

const scrollRef = ref<ScrollbarInst>()

const scrollClassName = ref({
  ['sliding-window-top-mask']: false,
  ['sliding-window-bottom-mask']: false
}) // 滚动条动态class类名

const maxScrollLeft = ref(0) // 最大的scrollLeft值

const handleScroll = (e: any) => {
  const curLeft = ~~e.target.scrollLeft
  // 获取最大的scrollLeft值
  if (!maxScrollLeft.value) {
    maxScrollLeft.value = curLeft
    scrollRef.value?.scrollTo({ left: 0 })
    return
  }
  if (!curLeft) {
    //   当前移动到了最左侧
    scrollClassName.value = {
      ['sliding-window-top-mask']: false,
      ['sliding-window-bottom-mask']: true
    }
  } else if (curLeft === maxScrollLeft.value) {
    //   当前移动到了最右侧
    scrollClassName.value = {
      ['sliding-window-top-mask']: true,
      ['sliding-window-bottom-mask']: false
    }
  } else {
    //   当前移动到了中间区域
    scrollClassName.value = {
      ['sliding-window-top-mask']: true,
      ['sliding-window-bottom-mask']: true
    }
  }
}

onMounted(() => {
  scrollRef.value?.scrollTo({ left: 2000 })
})
</script>

<template>
  <n-scrollbar
    class="sliding-window-container"
    :style="{ maxWidth }"
    x-scrollable
    :on-scroll="handleScroll"
    ref="scrollRef"
    :class="scrollClassName"
  >
    <div class="sliding-window-inner" :style="{ width: initialWidth }">
      <slot name="default"></slot>
    </div>
  </n-scrollbar>
</template>

<style lang="less">
.sliding-window-container {
  --show-top-mask: 0;
  --show-bottom-mask: 0;
  --mask-size: 20px;
  --gradient: linear-gradient(
    to right,
    transparent 0%,
    white calc(var(--show-top-mask) * var(--mask-size)),
    white calc(100% - calc(var(--mask-size) * var(--show-bottom-mask))),
    transparent 100%
  );
  -webkit-mask-image: var(--gradient);
  mask-image: var(--gradient);
}

.sliding-window-top-mask {
  --show-top-mask: 1;
}

.sliding-window-bottom-mask {
  --show-bottom-mask: 1;
}

.sliding-window-inner {
  padding-bottom: 10px;
}
</style>
