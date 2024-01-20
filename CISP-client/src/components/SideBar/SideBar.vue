<script lang="ts" setup>
import { ref } from 'vue'
import MenuWrapper from '@/components/SideBar/Menu.vue'
import { NTooltip, NIcon } from 'naive-ui'
import { LogoGooglePlaystore } from '@vicons/ionicons5'

const collapse = ref<boolean>(false) // 是否折叠菜单栏

// 折叠/打开菜单栏
const menuControl = () => (collapse.value = !collapse.value)
</script>

<template>
  <div class="sideBarContainer">
    <menu-wrapper :collapsed="collapse" />
    <div class="collapseBtn">
      <n-tooltip>
        <template #trigger>
          <n-icon class="icon">
            <logo-google-playstore :class="{ collapse }" @click="menuControl" />
          </n-icon>
        </template>
        <template #default>
          <span>{{ collapse ? '展开' : '折叠' }}</span>
        </template>
      </n-tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../../styles/var.less';

.sideBarContainer {
  height: 100%;
  position: relative;
  border-width: 0;
  background: @baseThemeColor;
}

.collapseBtn {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  & .icon {
    font-size: 1.5em;
    font-weight: 0;
    &:hover {
      color: #0d478cde;
    }
  }
}

.collapse {
  transform: rotate(180deg);
}
</style>
