<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import SideBar from '@/components/SideBar/SideBar.vue'
import FooterIndex from '@/components/Footer/FooterIndex.vue'
import HeaderIndex from '@/components/Header/HeaderIndex.vue'
import { useUserStore } from '@/stores/user'
import { useLoadingStore } from '@/stores/loading'
import { SessionStorageItemName } from '@/types/enum'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, onMounted } from 'vue'
import type { Meta } from '@/types/route'
import MessageProvider from '@/components/MessageProvider.vue'
import {
  NMessageProvider,
  NLayoutFooter,
  NLayoutHeader,
  NLayoutContent,
  NLayoutSider,
  NLayout,
  NConfigProvider,
  GlobalThemeOverrides
} from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#228ee3',
    primaryColorHover: '#e8a424'
  }
}

const routeConfig = computed(() => useRoute().meta as unknown as Meta)

const { whoAmI } = useUserStore()
const loadingStore = useLoadingStore()

const { isLoading } = storeToRefs(loadingStore)

onBeforeMount(async () => {
  loadingStore.changeLoading(true)
  if (!sessionStorage.getItem(SessionStorageItemName.User)) {
    await whoAmI()
  }
})

onMounted(() => {
  setTimeout(() => {
    loadingStore.changeLoading(false)
  }, 100)
})
</script>

<template>
  <n-message-provider>
    <n-config-provider :theme-overrides="themeOverrides">
      <n-layout has-sider v-if="routeConfig.layout" v-screen-loading="isLoading">
        <n-layout-sider class="app-n-layout-aside">
          <side-bar />
        </n-layout-sider>
        <n-layout-content content-class="layout-content-mainContainer">
          <n-layout-header class="app-n-layout-header">
            <header-index />
          </n-layout-header>
          <n-layout-content class="app-n-layout-content-mainContent">
            <RouterView />
          </n-layout-content>
          <n-layout-footer>
            <footer-index />
          </n-layout-footer>
        </n-layout-content>
      </n-layout>
      <RouterView v-else />
      <message-provider />
    </n-config-provider>
  </n-message-provider>
</template>

<style lang="less">
@import 'styles/var.less';

.app-n-layout-aside {
  height: 100vh;
  width: fit-content;
}

.app-n-layout-content-mainContent {
  min-height: calc(100vh - 160px);
  padding:20px 10px;
}

.app-n-layout-header {
  background-color: @headerBgColor;
  height: 56px;
}

.layout-content-mainContainer{
  display: flex;
  flex-direction: column;
}
</style>
