<script lang="ts" setup>
import routes from '@/router/routes'
import { ref } from 'vue'
import MenuItem from '@/components/SideBar/MenuItem.vue'
import { Expand, Fold } from '@element-plus/icons-vue'

const collapse = ref<boolean>(false) // 是否折叠菜单栏

// 折叠菜单栏
const fold = () => (collapse.value = true)

// 打开菜单栏
const expand = () => (collapse.value = false)
</script>

<template>
  <div class="sideBarContainer">
    <el-menu class="elMenu" router :collapse="collapse">
      <menu-item :routes="routes" />
    </el-menu>
    <div class="collapseBtn">
      <el-tooltip :content="collapse ? '展开' : '折叠'">
        <el-icon class="icon">
          <Expand v-show="collapse" @click="expand" />
          <Fold v-show="!collapse" @click="fold" />
        </el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped>
.elMenu {
  --el-menu-bg-color: #b0d6ffb5;
  --el-menu-hover-bg-color: #0d478cde;
  height: 100vh;
  position: relative;
  &:not(.el-menu--collapse) {
    width: 200px;
  }
}

.collapseBtn {
  position: absolute;
  bottom: 0;
  left: 20px;
  cursor: pointer;
  & .icon {
    font-size: 1.5em;
    font-weight: 0;
    &:hover {
      color: #0d478cde;
    }
  }
}
</style>
