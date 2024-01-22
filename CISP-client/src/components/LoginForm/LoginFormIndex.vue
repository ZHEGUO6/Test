<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getCurrentInstance, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptcha, validateCaptcha } from '@/api/captcha'
import { validate } from '@/api/user'
import { SessionStorageItemName, ValidateLoginEnum } from '@/types/enum'
import { Aperture } from '@vicons/ionicons5'
import { formValidators } from '@/utils/validate'
import GetCaptchaIndex from '@/components/GetCaptcha/GetCaptchaIndex.vue'
import {
  NForm,
  NFormItem,
  NInput,
  NFormItemGi,
  NSelect,
  NGi,
  NIcon,
  NScrollbar,
  NSwitch,
  NText,
  NButton,
  NGrid,
  FormRules,
  FormInst,
  MessageOptions
} from 'naive-ui'
import LinkIndex from '@/components/Link/LinkIndex.vue'
import CountDown from '@/components/CounDown.vue'

const props = defineProps<{ changeType: () => void }>()
const { changeType } = toRefs(props)

/**
 * data定义
 */
const form = reactive<API.User.Login & { captcha: string }>({
  nickname: '',
  loginPwd: '',
  captcha: '',
  saveTime: 0
})

const getTimeRef = ref<{ [key: string]: any }>()

const router = useRouter()
const { login } = useUserStore()
const { isLogin } = storeToRefs(useUserStore())
const screenLoading = ref<boolean>(false) // 是否整个页面设置loading
const btnLoading = ref<boolean>(false) // 是否登录按钮loading
const app = getCurrentInstance()?.appContext.config.globalProperties
const captcha = ref<HTMLElement>()
const selectOptions = [
  {
    label: '当前会话到期',
    value: 0
  },
  {
    label: '七天免登录',
    value: 1000 * 3600 * 24 * 7
  },
  {
    label: '十五天免登录',
    value: 1000 * 3600 * 24 * 15
  },
  {
    label: '三十天免登录',
    value: 1000 * 3600 * 24 * 30
  }
] // 选择免登录时间

const useAutoLogin = ref<boolean>(false) // 是否启用免登录
const formRef = ref<FormInst | null>(null)

const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '请填写昵称', trigger: ['input', 'blur'] },
    { min: 2, max: 10, message: '昵称的长度为2-10位', trigger: ['blur'] }
  ],
  loginPwd: [
    { required: true, message: '请填写密码', trigger: ['input', 'blur'] },
    { min: 8, message: '密码不能小于8位', trigger: ['blur'] },
    { max: 32, message: '密码不能超过32位', trigger: ['blur'] },
    {
      validator: (_, value) => formValidators.password.test(value),
      message: '密码格式不对，请重新填写'
    }
  ],
  captcha: [
    { required: true, message: '请填写验证码', trigger: ['input', 'blur'] },
    { len: 6, message: '请正确填写验证码', trigger: ['blur'] },
    {
      asyncValidator: (_, value, callback) =>
        new Promise(() => {
          validateCaptcha({ captcha: value }).then(
            (res: API.ServerResponse) => {
              if (res.code !== 200) {
                callback(res.msg)
                return
              }
              callback()
            },
            (err: Error) => {
              callback(err.message)
            }
          )
        }),
      trigger: ['blur']
    }
  ]
})

/**
 * 方法定义
 */

// 关闭所有的Loading状态
const closeAllLoading = () => {
  screenLoading.value = false
  btnLoading.value = false
}

// 登录
const _login = async () => {
  screenLoading.value = true
  btnLoading.value = true
  // 进行密码验证
  const res = await validate({ nickname: form.nickname, loginPwd: form.loginPwd }).catch(() => ({
    code: 500
  }))
  if (res.code === 500) {
    app?.$message('接口请求超时，服务器问题，请稍后重试', { type: 'error', duration: 2000 })
    return
  } else if (!res.data) {
    app?.$message(`您填写的昵称或密码不正确，请核对后操作，点击关闭按钮不会清空您已填写的内容`, {
      type: 'error',
      duration: 3000,
      onClose: (type?: string) => {
        if (!type) {
          form.nickname = form.loginPwd = '' // 清空昵称和密码
        }
        form.captcha = ''
        getCaptchaAsync()
        getTimeRef.value?.resetCountDownTime() // 重置验证码时间
      }
    } as MessageOptions)
    closeAllLoading()
    return
  }
  if (!useAutoLogin.value) {
    //   未开启免登录，将免登录时间改为0
    form.saveTime = 0
  }
  await login(form)
  if (isLogin.value) {
    app?.$message('恭喜您，登录成功，正在跳转首页...', {
      type: 'success',
      duration: 1500
    } as MessageOptions)
    closeAllLoading()
    await router.push('/')
    return
  }
  closeAllLoading()
}

// 表单提交事件
const onSubmit = async () => {
  // 进行整体表单校验
  let error = false
  await formRef.value?.validate().catch(() => (error = true))
  if (error) {
    //   表单校验未通过
    app?.$message(`未按要求填写表单内容，请继续完善后提交`, {
      type: 'error',
      duration: 2000
    })
    return
  }
  // 表单验证通过
  await _login()
}

// 获取验证码
const getCaptchaAsync = async () => {
  const val = await getCaptcha()
  captcha.value = val as unknown as HTMLElement
  sessionStorage.setItem('loginCaptcha', val as unknown as string)
}

// 按钮更换验证码
const btnGetCaptcha = async () => {
  await getCaptchaAsync()
  form.captcha = ''
}

onBeforeMount(async () => {
  const captchaData = sessionStorage.getItem(SessionStorageItemName.LoginCaptcha)
  captchaData ? (captcha.value = captchaData as unknown as HTMLElement) : await getCaptchaAsync()
})
</script>

<template>
  <div>
    <n-scrollbar>
      <n-form
        :model="form"
        label-width="80"
        :rules="rules"
        ref="formRef"
        class="loginFormOrRegistryForm"
        require-mark-placement="left"
      >
        <n-form-item label="昵称" first :required="true" path="nickname">
          <n-input
            :input-props="{ autocomplete: 'on' }"
            :clearable="true"
            v-model:value="form.nickname"
            placeholder="请填写昵称"
          />
        </n-form-item>
        <n-form-item label="密码" first path="loginPwd" :required="true">
          <n-input
            :input-props="{ autocomplete: 'on' }"
            :clearable="true"
            type="password"
            v-model:value="form.loginPwd"
            show-password-on="click"
            placeholder="请填写密码"
          />
        </n-form-item>
        <n-form-item :required="true" first label="验证码" path="captcha" class="alignCenter">
          <n-grid class="gridCenter">
            <n-gi :span="8">
              <n-input
                v-model:value="form.captcha"
                placeholder="请填写验证码"
                :input-props="{ autocomplete: 'on' }"
                :clearable="true"
              />
            </n-gi>
            <n-gi :span="1" />
            <n-gi :span="7">
              <div class="captchaContainer" v-html="captcha" />
            </n-gi>
            <n-gi :span="1" />
            <n-gi :span="7">
              <get-captcha-index
                ref="getTimeRef"
                @change="btnGetCaptcha"
                :storage="false"
                auto-refresh
                :storage-item-name="SessionStorageItemName.LoginCaptchaValidateTime"
              >
                <template #activeContent="{ countChange, countTime }">
                  <n-button disabled type="info" class="loginFormCaptchaBtn">
                    <count-down :on-change="countChange" :time="countTime" />
                    <n-text>&nbsp;秒后自动获取验证码</n-text>
                  </n-button>
                </template>
                <template #finishContent="{ clickFunc }">
                  <n-button class="loginFormCaptchaBtn" type="primary" @click="clickFunc">
                    <n-text>获取验证码</n-text>
                  </n-button>
                </template>
              </get-captcha-index>
            </n-gi>
          </n-grid>
        </n-form-item>
        <n-grid>
          <n-form-item-gi :span="5">
            <n-switch v-model:value="useAutoLogin">
              <template #checked>
                <n-text>关闭免登录</n-text>
              </template>
              <template #unchecked>
                <n-text>开启免登录</n-text>
              </template>
            </n-switch>
          </n-form-item-gi>
          <n-form-item-gi :span="6">
            <n-select
              v-if="useAutoLogin"
              v-model:value="form.saveTime"
              placeholder="请选择免登录时间"
              :options="selectOptions"
            />
          </n-form-item-gi>
        </n-grid>

        <n-button class="btnCenter" @click="onSubmit" :loading="btnLoading">
          <template #default>
            <n-text>登录</n-text>
          </template>
          <template #icon v-if="btnLoading">
            <n-icon>
              <aperture />
            </n-icon>
          </template>
        </n-button>
        <link-index type="info" class="forgetPwd" :underline="true" :to="{ name: 'forgetPwd' }"
          >忘记密码？点此查找密码</link-index
        >
        <div class="changeFormBtn" @click="changeType">
          <n-text class="txt">注册</n-text>
        </div>
      </n-form>
    </n-scrollbar>
  </div>
</template>
<style scoped lang="less">
.forgetPwd {
  margin-left: calc(50% - 77px);
  --n-color-info: #4a5467;
  font-size: 12px;
  cursor: pointer;
}

.gridCenter {
  align-items: center;
}

.loginFormCaptchaBtn {
  min-width: 170px;
}

.txt {
  cursor: pointer;
}
</style>
