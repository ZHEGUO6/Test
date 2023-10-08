<template>
  <template v-for="(item, index) in filter(props.routes)">
    <el-sub-menu
      class="subMenuContainer"
      v-if="item.children && item.children.length"
      :key="index"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span class="title">{{ item.meta.label }}</span>
      </template>
      <menu-item :routes="item.children" />
    </el-sub-menu>
    <el-menu-item
      class="menuItem hvr-overline-from-center hvr-bounce-to-right"
      :class="{
        active: isActive(item)
      }"
      :index="item.path"
      :key="item.meta.label"
      v-else
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <template #title>
        <span class="title">{{ item.meta.label }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecord } from '@/router/routes'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{ routes: Array<RouteRecord> }>()

const route = useRoute()
const matchedRoutes = computed(() => route.matched) // 匹配上的路由

const isActive = (item: RouteRecord) =>
  matchedRoutes.value.find((value) =>
    item.meta.exact ? value.path === item.path : value.path.includes(item.path)
  ) // 判断是否高亮当前菜单项

const filter = (routes: Array<RouteRecord>) => routes.filter((i) => !i.meta?.hideInMenu ?? false) // 过滤不需要在菜单栏显示的项
</script>

<style scoped>
.subMenuContainer {
  & .title {
    font-weight: bold;
  }
}

.menuItem {
  display: flex;
  padding-left: 10px;
  & .title {
    font-weight: bold;
  }
  &:hover,
  &:hover .title {
    color: var(--el-menu-hover-text-color);
  }
  &.active {
    background-color: var(--el-menu-hover-bg-color);
    color: var(--el-menu-active-color);
  }
}
</style>
