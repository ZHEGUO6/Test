<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeMount, reactive, ref, getCurrentInstance, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptcha, validateCaptcha } from '@/api/captcha'
import { validate } from '@/api/user'
import { SessionStorageItemName, ValidateLoginEnum } from '@/types/enum'
import { FormInstance, FormRules } from 'element-plus'
import { MessageOptions } from 'element-plus/lib/components'
import { Sunny } from '@element-plus/icons-vue'
import { formValidators } from '@/utils/validate'
import GetCaptchaIndex from '@/components/GetCaptcha/GetCaptchaIndex.vue'

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
const captchaValidated = ref(false) // 验证码是否验证通过
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
const formRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof form>>({
  nickname: [
    { required: true, message: '请填写昵称' },
    { min: 2, max: 10, message: '昵称的长度为2-10位', trigger: ['blur'] }
  ],
  loginPwd: [
    { required: true, message: '请填写密码' },
    { min: 8, message: '密码不能小于8位', trigger: ['blur'] },
    { max: 32, message: '密码不能超过32位', trigger: ['blur'] },
    {
      validator: (_, value, callback) => {
        if (formValidators.password.test(value)) {
          callback()
        } else {
          callback('密码格式不对，请重新填写')
        }
      }
    }
  ],
  captcha: [
    { required: true, message: '请填写验证码' },
    { len: 6, message: '请正确填写验证码，正确填写后自动登录哦' },
    {
      validator: (_, value, callback) => {
        validateCaptcha({ captcha: value }).then(
          (res: API.ServerResponse) => {
            if (res.code !== 200) {
              callback(res.msg)
              return
            }
            callback()
            captchaValidated.value = true
            onSubmit() // 验证码验证通过，提交表单
          },
          (err: Error) => {
            callback(err.message)
          }
        )
      }
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
  if (res.code !== 200 && res.code !== 500) {
    app?.$message({
      type: 'error',
      message: `您填写的昵称或密码不正确，请核对后操作，点击关闭按钮不会清空您已填写的内容`,
      duration: 3000,
      onClose: (type?: string) => {
        if (!type) {
          formRef.value?.resetFields(['nickname', 'loginPwd']) // 清空昵称和密码
        }
        formRef.value?.resetFields(['captcha'])
        getCaptchaAsync()
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
    app?.$message({
      type: 'success',
      message: '恭喜您，登录成功，正在跳转首页...',
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
  if (captchaValidated.value) {
    //   验证码已通过验证
    formRef.value?.validateField(
      [ValidateLoginEnum.NickName, ValidateLoginEnum.LoginPwd],
      async (isValid) => {
        if (isValid) {
          await _login()
        }
      }
    )
  } else {
    // 进行整体表单校验
    const formValidate = await formRef.value?.validate().catch((err: Error) => err)
    if (typeof formValidate === 'object') {
      //   表单校验未通过
      app?.$message({
        type: 'error',
        message: `未按要求填写表单内容，请继续完善后提交`,
        duration: 2000
      })
      return
    }
    // 表单验证通过
    await _login()
  }
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
  <el-form
    :model="form"
    label-position="left"
    label-width="80"
    status-icon
    :rules="rules"
    ref="formRef"
    class="loginFormOrRegistryForm"
    v-loading.fullscreen="screenLoading"
    element-loading-text="正在登录中，请稍后......"
    element-loading-background="rgb(39 82 92 / 54%)"
  >
    <el-form-item label="昵称" :required="true" prop="nickname" :key="ValidateLoginEnum.NickName">
      <el-input
        v-model="form.nickname"
        placeholder="请填写昵称"
        autocomplete="on"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item
      label="密码"
      :required="true"
      prop="loginPwd"
      :key="ValidateLoginEnum.LoginPwd"
      autocomplete="on"
    >
      <el-input
        type="password"
        v-model="form.loginPwd"
        :show-password="true"
        placeholder="请填写密码"
        autocomplete="on"
        :clearable="true"
      />
    </el-form-item>
    <el-form-item
      label="验证码"
      :required="true"
      prop="captcha"
      :key="ValidateLoginEnum.Captcha"
      class="alignCenter"
    >
      <el-col :span="6">
        <el-input
          v-model="form.captcha"
          placeholder="请填写验证码"
          autocomplete="on"
          :clearable="true"
        />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="6">
        <div class="captchaContainer" v-html="captcha" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="9">
        <get-captcha-index
          :on-change="btnGetCaptcha"
          :storage="false"
          :storage-item-name="SessionStorageItemName.LoginCaptchaValidateTime"
        />
      </el-col>
    </el-form-item>

    <el-form-item :key="ValidateLoginEnum.SaveTime">
      <el-row>
        <el-col :span="8">
          <el-switch
            active-text="关闭免登录"
            inactive-text="开启免登录"
            v-model="useAutoLogin"
            :inline-prompt="true"
            >开启免登录</el-switch
          >
        </el-col>
        <el-col :span="12">
          <el-select v-if="useAutoLogin" v-model="form.saveTime" placeholder="请选择免登录时间">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-col>
        <el-button class="btnCenter" @click="onSubmit" :loading-icon="Sunny" :loading="btnLoading"
          >登录</el-button
        >
      </el-col>
    </el-form-item>
    <el-col>
      <el-link
        type="info"
        class="forgetPwd"
        :underline="false"
        @click="() => router.push({ name: 'forgetPwd' })"
        >忘记密码？点此查找密码</el-link
      >
    </el-col>
    <el-link class="changeFormBtn" @click="changeType">
      <el-text class="txt">注册</el-text>
    </el-link>
  </el-form>
</template>
<style scoped lang="less">
.forgetPwd {
  margin-left: calc(50% - 77px);
  --el-color-info: #4a5467;
  font-size: 12px;
}
</style>
