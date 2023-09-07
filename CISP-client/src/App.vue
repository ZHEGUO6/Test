<template>
  <el-container v-if="routeConfig.layout">
    <el-aside>
      <div>
        侧边栏
      </div>
    </el-aside>
    <el-header>
      <nav>页头</nav>

    </el-header>
    <el-main>
      <RouterView />
    </el-main>
    <el-footer>

    </el-footer>
  </el-container>
  <RouterView v-else />
</template>

<script lang="ts" setup>
import { RouterView,useRoute } from 'vue-router'
import {computed,ComputedRef} from 'vue'
import type {RouteMeta} from "@/types/route";

const routeConfig=useRoute().meta as unknown as RouteMeta;
</script>

<style scoped>

</style>
