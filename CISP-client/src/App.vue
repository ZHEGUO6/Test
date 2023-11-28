<script lang="ts" setup>
import { RouterView, useRoute } from "vue-router";
import SideBar from "@/components/SideBar/SideBar.vue";
import FooterIndex from "@/components/Footer/FooterIndex.vue";
import HeaderIndex from "@/components/Header/HeaderIndex.vue";
import { useUserStore } from "@/stores/user";
import { useLoadingStore } from "@/stores/loading";
import { SessionStorageItemName } from "@/types/enum";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted } from '"vue";import type { Meta } from '@/types/route'

const routeConfig = computed(() => useRoute().meta as unknown as Meta)

const { whoAmI } = useUserStore()
const loadingStore = useLoadingStore();

const { isLoading } = storeToRefs(loadingStore);

onBeforeMount(async () => {
  loadingStore.changeLoading(true);
  if (!sessionStorage.getItem(SessionStorageItemName.User)) {
    await whoAmI()
  }
})

onMounted(() => {
  setTimeout(() => {
    loadingStore.changeLoading(false);
  }, 100);
});
</script>

<template>
  <el-container v-if="routeConfig.layout" v-screen-loading="isLoading">
    <el-aside class="elAside">
      <side-bar />
    </el-aside>
    <el-main class="mainContainer">
      <el-header class="elHeader">
        <header-index />
      </el-header>
      <el-main class="mainContent">
        <RouterView />
      </el-main>
      <el-footer>
        <footer-index />
      </el-footer>
    </el-main>
  </el-container>
  <RouterView v-else />
</template>

<style scoped lang="less">
@import 'styles/var.less';

.elAside {
  height: 100vh;
  width: fit-content;
}

.mainContainer {
  --el-main-padding: 0;
  background-color: aliceblue;
}

.mainContent {
  min-height: calc(100vh - 160px);
  --el-main-padding: 10px;
}

.elHeader {
  --el-header-padding: 7px 15px;
  background-color: @headerBgColor;
  height: 56px;
}
</style>
