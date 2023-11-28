<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import EmptyIndex from '@/components/Empty/EmptyIndex.vue'
import { getNewsCount, getNewsList } from '@/api/new'
import { getNoticeCount } from '@/api/notice'
import { onBeforeMount, ref } from 'vue'
import { Warning } from '@element-plus/icons-vue'
import './styles/reset.less'
import { RoutePath } from '@/types/route'

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
const noticeData = ref({
  count: 0,
  importantCount: 0,
  list: []
})

const linkTo = (url: string) => {
  router.push(url)
}

const handleOut = async () => {
  await userStore.loginOut()
  await router.push({
    name: 'loginOrRegistry',
    state: {
      type: 'login'
    }
  })
}
console.log(newsData.value.importantCount)
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
  <el-scrollbar max-height="78vh">
    <main class="homeContainer">
      <el-space class="originElSpace" direction="vertical" :size="20">
        <el-row></el-row>
        <el-row justify="space-evenly">
          <el-col :span="11">
            <el-card
              shadow="hover"
              :body-style="{
                ['min-height']: !newsData.count && `${noticeData.count * 72 + 42}px`,
                display: newsData.count ? 'block' : 'flex'
              }"
            >
              <template #header>
                <a-flex align="center" justify="space-between" class="card-header">
                  <span>新闻</span>
                  <el-space size="2">
                    <el-tooltip content="重要新闻总数">
                      <el-button color="#f00" circle>{{ newsData.importantCount }}</el-button>
                    </el-tooltip>
                    <el-tooltip content="新闻总数">
                      <el-button color="#ffde46" circle>{{ newsData.count }}</el-button>
                    </el-tooltip>
                  </el-space>
                </a-flex>
              </template>
              <empty-index :data="newsData.count">
                <template #content>
                  <a-list bordered :data-source="newsData.list" class="card-content">
                    <template #renderItem="{ item }: { item: API.News.GetInfo }">
                      <a-list-item :key="item.newId">
                        <a-list-item-meta :description="item.content">
                          <template #title>
                            <a-flex gap="middle">
                              <el-link
                                @click="linkTo(`${RoutePath.News}/${item.newId}`)"
                                :underline="false"
                                >{{ item.title }}
                              </el-link>
                              <el-tag :type="item.important ? 'danger' : ''"
                                >{{ item.important ? '重要' : '普通' }}
                              </el-tag>
                            </a-flex>
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </template>
                <template #empty>
                  <el-result>
                    <template #title>
                      <el-text type="danger" class="nowrap">暂无新闻数据</el-text>
                    </template>
                    <template #icon>
                      <el-icon color="#f56c6c">
                        <Warning />
                      </el-icon>
                    </template>
                  </el-result>
                </template>
              </empty-index>
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card
              shadow="hover"
              :body-style="{
                ['min-height']: !noticeData.count && `${newsData.count * 72 + 42}px`,
                display: noticeData.count ? 'block' : 'flex'
              }"
            >
              <template #header>
                <a-flex align="center" justify="space-between">
                  <span>公告</span>
                  <el-space size="2">
                    <el-tooltip content="重要公告总数">
                      <el-button color="#f00" circle>{{ noticeData.importantCount }}</el-button>
                    </el-tooltip>
                    <el-tooltip content="公告总数">
                      <el-button color="#ffde46" circle>{{ noticeData.count }}</el-button>
                    </el-tooltip>
                  </el-space>
                </a-flex>
              </template>
              <empty-index :data="noticeData.count">
                <template #content>
                  <a-list bordered :data-source="noticeData.list">
                    <template #renderItem="{ item }: { item: API.Notice.Get }">
                      <a-list-item :key="item.noticeId">
                        <a-list-item-meta :content="item.content">
                          <template #title>
                            <a-flex gap="middle">
                              <el-link
                                @click="linkTo(`${RoutePath.Bulletin}/${item.newId}`)"
                                :underline="false"
                                >{{ item.title }}
                              </el-link>
                              <el-tag :type="item.important ? 'danger' : ''"
                                >{{ item.important ? '重要' : '普通' }}
                              </el-tag>
                            </a-flex>
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </template>
                <template #empty>
                  <a-flex vertical align="center" gap="middle" justify="center" flex="1">
                    <el-icon size="4rem" color="#f56c6c">
                      <Warning />
                    </el-icon>
                    <el-text type="danger" class="nowrap">暂无公告数据</el-text>
                  </a-flex>
                </template>
              </empty-index>
            </el-card>
          </el-col>
        </el-row>
        <el-row justify="space-evenly">
          <el-col :span="11">
            <el-card shadow="hover" class="">
              <template #header>数据统计</template>
              <empty-index :data="0">
                <template #content>
                  <div>123</div>
                </template>
                <template #empty> empty</template>
              </empty-index>
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card shadow="hover" class="">
              <template #header>便捷浏览</template>
              <div>123</div>
            </el-card>
          </el-col>
        </el-row>
        <div>欢迎你，{{ userInfo.nickname }}</div>
        <div>
          <el-button @click="handleOut">退出登录</el-button>
        </div>
      </el-space>
    </main>
  </el-scrollbar>
</template>

<style scoped lang="less">
@import 'src/styles/var';
@import 'src/styles/scoped.module.css';
</style>
