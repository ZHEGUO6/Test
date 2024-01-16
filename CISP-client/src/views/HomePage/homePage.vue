<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import EmptyIndex from '@/components/Empty/EmptyIndex.vue'
import { getNewsCount, getNewsList } from '@/api/new'
import { getNoticeCount } from '@/api/notice'
import { onBeforeMount, ref, computed } from 'vue'
import { AlertCircleOutline } from '@vicons/ionicons5'
import './styles/reset.less'
import { RoutePath } from '@/types/route'
import LinkIndex from '@/components/Link/LinkIndex.vue'
import {
  NIcon,
  NSpace,
  NScrollbar,
  NGrid,
  NGi,
  NCard,
  NTooltip,
  NList,
  NListItem,
  NButton,
  NTag,
  NText,
  NResult,
  NFlex
} from 'naive-ui'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const router = useRouter()

// 新闻数据
const newsData = ref<{ count: number; importantCount: number; list: Array<API.News.GetInfo> }>({
  count: 0,
  importantCount: 0,
  list: []
})

// 公告数据
const noticeData = ref<{ count: number; important: number; list: Array<API.Notice.Get> }>({
  count: 0,
  important: 0,
  list: []
})

// 新闻卡片主区域样式
const newsCardBodyStyle = computed(() => ({
  ['min-height']: !newsData.value.count && `${noticeData.value.count * 72 + 42}px`,
  display: newsData.value.count ? 'block' : 'flex'
}))

// 公告卡片主区域样式
const noticeCardBodyStyle = computed(() => ({
  ['min-height']: !noticeData.value.count && `${newsData.value.count * 72 + 42}px`,
  display: noticeData.value.count ? 'block' : 'flex'
}))

const handleOut = async () => {
  await userStore.loginOut()
  await router.push({
    name: 'loginOrRegistry',
    state: {
      type: 'login'
    }
  })
}

onBeforeMount(async () => {
  // 获取新闻数据
  const { data: newData } = await getNewsCount()
  const { data: newsListInfo } = await getNewsList({ page: 1, limit: 5 })
  newsData.value = {
    list: newsListInfo?.datas,
    count: newsListInfo?.count,
    importantCount: newData.find((i: API.News.GetInfo) => i.important)?.count ?? 0
  }

  // 获取公告数据
  const { data: noticeData } = await getNoticeCount()
  const { data: noticeListInfo } = await getNewsList({ page: 1, limit: 5 })
  noticeData.value = {
    list: noticeListInfo?.datas,
    count: noticeListInfo?.count,
    importantCount: noticeData.find((i: API.Notice.Get) => i.important)?.count ?? 0
  }
})
</script>

<template>
  <n-scrollbar max-height="78vh">
    <main class="homePage-container">
      <n-space vertical class="originElSpace" :size="20">
        <n-flex :wrap="false" justify="space-between">
          <n-card
            header-class="homePage-card-header"
            content-class="homePage-card-content"
            hoverable
            :body-style="newsCardBodyStyle"
          >
            <template #header>
              <n-flex align="center" justify="space-between">
                <span>新闻</span>
                <n-space :size="2">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button color="#f00" circle>{{ newsData.importantCount }}</n-button>
                    </template>
                    <template #default> 重要新闻总数 </template>
                  </n-tooltip>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button color="#ffde46" circle>{{ newsData.count }}</n-button>
                    </template>
                    <template #default> 新闻总数 </template>
                  </n-tooltip>
                </n-space>
              </n-flex>
            </template>
            <empty-index :data="newsData.count">
              <template #content>
                <n-list bordered :data-source="newsData.list" class="homePage-card-content">
                  <n-list-item :key="item.newId" v-for="item in newsData.list">
                    <template #prefix>
                      <n-space>
                        <link-index :to="`${RoutePath.News}/${item.newId}`"
                          >{{ item.title }}
                        </link-index>
                        <n-tag :type="item.important ? 'error' : 'default'"
                          >{{ item.important ? '重要' : '普通' }}
                        </n-tag>
                      </n-space>
                    </template>
                    <n-text>{{ item.content }}</n-text>
                  </n-list-item>
                </n-list>
              </template>
              <template #empty>
                <n-result status="error" title="暂无新闻数据"> </n-result>
              </template>
            </empty-index>
          </n-card>
          <n-card
            header-class="homePage-card-header"
            content-class="homePage-card-content"
            hoverable
            :body-style="noticeCardBodyStyle"
          >
            <template #header>
              <n-space align="center" justify="space-between">
                <span>公告</span>
                <n-space :size="2">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button color="#f00" circle>{{ noticeData.important }}</n-button>
                    </template>
                    <template #default> 重要公告总数 </template>
                  </n-tooltip>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button color="#ffde46" circle>{{ noticeData.count }}</n-button>
                    </template>
                    <template #default> 公告总数 </template>
                  </n-tooltip>
                </n-space>
              </n-space>
            </template>
            <empty-index :data="noticeData.count">
              <template #content>
                <n-list bordered :data-source="noticeData.list">
                  <n-list-item :key="item.noticeId" v-for="item in noticeData.list">
                    <template #prefix>
                      <n-space gap="middle">
                        <link-index :to="`${RoutePath.Bulletin}/${item.noticeId}`"
                          >{{ item.title }}
                        </link-index>
                        <n-tag :type="item.important ? 'error' : 'default'"
                          >{{ item.important ? '重要' : '普通' }}
                        </n-tag>
                      </n-space>
                    </template>
                    <n-text>{{ item.content }}</n-text>
                  </n-list-item>
                </n-list>
              </template>
              <template #empty>
                <n-result status="error" title="暂无公告数据"> </n-result>
              </template>
            </empty-index>
          </n-card>
        </n-flex>
        <n-flex :wrap="false" justify="space-between">
          <n-card
            hoverable
            header-class="homePage-card-header"
            content-class="homePage-card-content"
          >
            <template #header>数据统计</template>
            <empty-index :data="0">
              <template #content>
                <div>123</div>
              </template>
              <template #empty>
                <n-result status="error" title="暂无相关数据"> </n-result>
              </template>
            </empty-index>
          </n-card>
          <n-card
            header-class="homePage-card-header"
            content-class="homePage-card-content"
            hoverable
          >
            <template #header>便捷浏览</template>
            <empty-index :data="0">
              <template #content>
                <div>123</div>
              </template>
              <template #empty>
                <n-result status="error" title="暂无相关数据"> </n-result>
              </template>
            </empty-index>
          </n-card>
        </n-flex>
        <div>欢迎你，{{ userInfo.nickname }}</div>
        <div>
          <n-button @click="handleOut">退出登录</n-button>
        </div>
      </n-space>
    </main>
  </n-scrollbar>
</template>

<style lang="less">
@import 'src/styles/var';
@import 'src/styles/scoped.module.css';

.homePage-container {
  padding: 20px 10px;
}

.homePage-card-header {
  background: aliceblue;
}

.homePage-card-content {
  background: #b4dffd;
}
</style>
