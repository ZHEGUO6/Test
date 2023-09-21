<script lang="ts" setup>
import routes from '@/router/routes'
import {ref} from 'vue'
import MenuItem from '@/components/SideBar/MenuItem.vue'

const collapse=ref<boolean>(false);// 是否折叠菜单栏
</script>

<template>
  <div class="sideBarContainer">
    <el-menu class="elMenu" :router="true">
    <menu-item :routes="routes"/>
    </el-menu>

  </div>
</template>

<style scoped>
.elMenu{
  --el-menu-bg-color:#c8d1ff;
}
</style>