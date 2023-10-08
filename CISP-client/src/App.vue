<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import SideBar from '@/components/SideBar/SideBar.vue'
import FooterIndex from '@/components/Footer/FooterIndex.vue'
import HeaderIndex from '@/components/Header/HeaderIndex.vue'
import { computed } from 'vue'
import type { Meta } from '@/types/route'
const routeConfig = computed(() => useRoute().meta as unknown as Meta)
</script>

<template>
  <el-container v-if="routeConfig.layout">
    <el-aside class="elAside">
      <side-bar />
    </el-aside>
    <el-main>
      <el-header>
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

<style scoped>
.elAside {
  height: 100vh;
  width: fit-content;
}

.mainContent {
  min-height: calc(100vh - 160px);
}
</style>
