<script setup lang="ts">
import type { RouteRecord } from '@/router/routes'
import routes from '@/router/routes'
import { useRoute } from 'vue-router'
import { computed, ref, onBeforeMount, Component, h } from 'vue'
import { NIcon, NMenu } from 'naive-ui'
import { last as _last } from 'lodash'
import { useRouter } from 'vue-router'
import { MenuProps } from 'naive-ui'

type MenuThemeOverrides = NonNullable<MenuProps['themeOverrides']>

const props = defineProps<{ collapsed: boolean }>()

const route = useRoute()
const router = useRouter()
const matchedRoutes = computed(() => route.matched) // 匹配上的路由

const menuThemeOverrides: MenuThemeOverrides = {
  itemColorHover: '#b5d2ff'
}

const curActiveKey = ref('home') // 当前激活的路由

// 渲染icon组件
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 将路由对应的信息映射成menuoptions
const mapToMenuOptions = (routes: Array<RouteRecord>) => {
  const _cycle = (routeItem: RouteRecord) => {
    const newRoute = {
      ...routeItem,
      ...routeItem.meta,
      icon: renderIcon(routeItem.meta.icon)
    }
    if (routeItem.children) {
      newRoute.children = mapToMenuOptions(routeItem.children)
    }
    return newRoute
  }
  return routes.map((i) => _cycle(i))
}

const menuRoutes = mapToMenuOptions(routes)
const menuKeyChange = (key: string) => {
  router.push({ name: key })
}

onBeforeMount(() => {
  curActiveKey.value = _last(matchedRoutes.value)?.name as string
})
</script>

<template>
  <n-menu
    v-model:value="curActiveKey"
    :options="menuRoutes"
    accordion
    :collapsed="props.collapsed"
    @update-value="menuKeyChange"
    :theme-overrides="menuThemeOverrides"
  >
  </n-menu>
</template>

<style scoped></style>
