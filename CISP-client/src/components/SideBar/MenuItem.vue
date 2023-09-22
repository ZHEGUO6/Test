<template>
  <template v-for="item in filter(routes)">
    <el-sub-menu v-if="item.children && item.children.length">
      <template #title>
        <el-text>{{ item.meta.label }}</el-text>
      </template>
      <menu-item :routes="item.children" />
    </el-sub-menu>
    <el-menu-item :index="item.path" v-else>
      <el-icon></el-icon>
      <el-text>{{ item.meta.label }}</el-text>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecord } from '@/router/routes'

const { routes } = defineProps<{ routes: Array<RouteRecord> }>()
const filter = (routes: Array<RouteRecord>) => routes.filter((i) => !i.meta.hideInMenu ?? false) // 过滤不需要在菜单栏显示的项
</script>

<style scoped></style>
