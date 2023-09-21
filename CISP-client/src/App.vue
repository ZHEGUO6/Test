<template>
  <el-container v-if="routeConfig.layout">
    <el-container>
      <el-aside class="elAside">
        <side-bar/>
      </el-aside>
      <el-main>
        <el-header>
          <nav>页头</nav>

        </el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-main>
    </el-container>
    <el-footer>

    </el-footer>
  </el-container>
  <RouterView v-else />
</template>

<script lang="ts" setup>
import { RouterView,useRoute, } from 'vue-router'
import SideBar from '@/components/SideBar/SideBar.vue';
import {computed} from 'vue'
import type {RouteMeta} from "@/types/route";
const routeConfig=computed(()=>useRoute().meta as unknown as RouteMeta);
</script>

<style scoped>
.elAside{
  --el-aside-width:200px;
}
</style>
