<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{ show: boolean }>()
const { show } = toRefs(props)
</script>

<template>
  <div class="screenLoadingContainer" v-show="show"></div>
</template>

<style lang="less" scoped>
.screenLoadingContainer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #4d4dff;
}
</style>
