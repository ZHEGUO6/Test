<script setup lang="ts">
const props = defineProps<{ show: boolean }>()
console.log(props)
</script>

<template>
  <div class="screenLoadingContainer" v-show="props.show"></div>
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
