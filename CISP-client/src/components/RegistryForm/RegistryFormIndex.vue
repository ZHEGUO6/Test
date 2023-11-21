<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { getCurrentInstance, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptcha, validateCaptcha } from '@/api/captcha'
import { SessionStorageItemName, ValidateRegistryEnum } from '@/types/enum'
import { FormInstance, FormRules } from 'element-plus'
import { MessageOptions } from 'element-plus/lib/components'
import { getAllInitialAvatar } from '@/api/image'
import AvatarUploadIndex from '@/components/AvatarUpload/AvatarUploadIndex.vue'
import { get as _get } from 'lodash'
import { v4 as uuid } from 'uuid'
import { Star } from '@element-plus/icons-vue'
import { formValidators } from '@/utils/validate'
import GetCaptchaIndex from '@/components/GetCaptcha/GetCaptchaIndex.vue'
import DistrictCascadeIndex from '@/components/DistrictCascader/DistrictCascadeIndex.vue'
import { simpleValidatorFunc } from '@/utils/validate'

const props = defineProps<{ changeType: () => void }>()

const { changeType } = toRefs(props)

/**
 * data定义
 */
const form = reactive<API.User.Add & { captcha: string; saveTime: number; confirmPwd: string }>({
  nickname: '',
  loginPwd: '',
  confirmPwd: '',
  captcha: '',
  saveTime: 0,
  avatar: '',
  mail: '',
  qq: '',
  wechat: '',
  intro: '',
  type: 'student',
  addr: '100000/116.3683244,39.915085',
  phone: '',
  birthDay: 0,
  loginId: uuid()
}) // 注册表单数据

// 设置四级联动选择框内容
const cascadeSet = reactive({
  province: '', // 选择的省份
  city: '', // 选择的城市
  district: '', // 选择的区县/街道
  street: ''
})

// 获取四级联动选择框内容
const cascadeGet = reactive({
  province: '', // 选择的省份
  city: '', // 选择的城市
  district: '', // 选择的区县/街道
  street: ''
})

const router = useRouter()
const { registry } = useUserStore()
const { isLogin } = storeToRefs(useUserStore())
const app = getCurrentInstance()?.appContext.config.globalProperties
const captcha = ref<HTMLElement>() // 验证码

// 选择免登录时间
const userTypeOptions = [
  {
    label: '学生',
    value: 'student'
  },
  {
    label: '老师',
    value: 'teacher'
  }
]

// 选择免登录时间
const autoLoginOptions = [
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
]

const initialAvatars = ref<Array<string>>([]) // 系统自带的头像列表

const useAutoLogin = ref<boolean>(false) // 是否启用免登录
const useMoreSettings = ref<boolean>(false) // 是否设置更多注册信息
const useUploadAvatar = ref<boolean>(false) // 是否上传自己的头像

const screenLoading = ref<boolean>(false) // 是否加载全屏过渡动画
const btnLoading = ref<boolean>(false) // 是否按钮加载过渡动画

const formRef = ref<FormInstance>()
const drawFormRef = ref<FormInstance>() // 抽屉注册表单ref

const rules = ref<FormRules<typeof form>>({
  type: [{ required: true, message: '请选择您的角色' }],
  nickname: [
    { required: true, message: '请填写昵称' },
    { min: 2, max: 10, message: '昵称的长度为2-10位', trigger: ['blur'] }
  ],
  loginPwd: [
    { required: true, message: '请填写密码' },
    { min: 8, message: '密码不能小于8位', trigger: ['blur'] },
    { max: 32, message: '密码不能超过32位', trigger: ['blur'] },
    {
      validator: simpleValidatorFunc(
        (value) => formValidators.password.test(value),
        '密码要求数字、字母加特殊字符'
      ),
      trigger: ['blur']
    }
  ],
  confirmPwd: [
    { required: true, message: '请再次输入密码' },
    {
      validator: simpleValidatorFunc(
        (value) => value === form.loginPwd,
        '两次输入的密码不一致，请检查'
      ),
      trigger: ['blur']
    }
  ],
  captcha: [
    { required: true, message: '请填写验证码' },
    { len: 6, message: '请正确输入验证码' },
    {
      validator: (_, value, callback) => {
        validateCaptcha({ captcha: value }).then(
          (res: API.ServerResponse) => {
            if (res.code !== 200) {
              callback(res.msg)
            }
            callback()
          },
          (err: Error) => {
            callback(err.message)
          }
        )
      }
    }
  ],
  mail: [
    {
      validator: simpleValidatorFunc(
        (value) => (value ? formValidators.mail.test(value) : true),
        '邮箱格式不对，请重新输入'
      ),
      trigger: ['blur']
    }
  ],
  qq: [
    {
      validator: simpleValidatorFunc(
        (value) => (value ? formValidators.qq.test(value) : true),
        'QQ号格式不对，请重新输入'
      ),
      trigger: ['blur']
    }
  ],
  wechat: [
    {
      validator: simpleValidatorFunc(
        (value) => (value ? formValidators.wechat.test(value) : true),
        '微信号格式不对，请重新输入'
      ),
      trigger: ['blur']
    }
  ],
  phone: [
    { required: true, message: '请填写手机号' },
    {
      validator: simpleValidatorFunc(
        (value) => (value ? formValidators.phone.test(value) : true),
        '手机号格式不对，请重新输入'
      ),
      trigger: ['blur']
    }
  ]
})

/**
 * 方法定义
 */

// 是否设置更多注册信息
const moreSettingSwitchChange = async (val: boolean) => {
  if (val) {
    //   进行基础表单校验
    await validateFormFields(
      () => (useMoreSettings.value = true),
      () =>
        app?.$message({
          type: 'error',
          message: `请先完善必填项再填写更多注册信息~`,
          duration: 3000
        })
    )
  }
}

// 头像上传成功
const avatarUploadSuccess = (response: API.ServerResponse) => {
  form.avatar = response.data as unknown as string
  app.$message({
    type: 'success',
    message: '恭喜您，头像上传成功'
  } as MessageOptions)
}

// 系统自定义头像点击事件
const initialAvatarClick = (e: any) => {
  const src = _get(e, 'target.src')
  src && (form.avatar = src)
}

// 进行基础表单的验证
const validateFormFields = async (
  onSuccess: () => void,
  onError?: (errorFields: any[]) => void
) => {
  //   进行基础表单校验
  const formValidate = await formRef.value?.validate().catch((err) => err)
  if (typeof formValidate === 'object') {
    //   表单校验未通过
    onError && onError(formValidate)
    return
  }
  // 表单验证通过
  onSuccess()
}

// 日期选择框判断该日期是否被禁用
const disabledDate = (d: Date) => d.getFullYear() < 1960

// 进行注册前的预处理动作
const preRegistry = () => {
  if (!useAutoLogin.value) {
    //   未开启免登录，将免登录时间改为0
    form.saveTime = 0
  }
  let addresses = [
    `${cascadeGet.province}/${cascadeSet.province}`,
    `${cascadeGet.city}/${cascadeSet.city}`,
    `${cascadeGet.district}/${cascadeSet.district}`,
    `${cascadeGet.street}/${cascadeSet.street}`
  ].filter((i) => i.length > 1)
  if (addresses.length) {
    form.addr = [
      `${cascadeGet.province}/${cascadeSet.province}`,
      `${cascadeGet.city}/${cascadeSet.city}`,
      `${cascadeGet.district}/${cascadeSet.district}`,
      `${cascadeGet.street}/${cascadeSet.street}`
    ]
      .filter((i) => i.length > 1)
      .join('-')
  }
  !form.qq && (form.qq = null)
  !form.wechat && (form.wechat = null)
  !form.mail && (form.mail = null)
  !form.phone && (form.phone = null)
  if (typeof form.birthDay !== 'number') {
    // 当前为日期对象
    form.birthDay = form.birthDay.getTime()
  }
}

// 开启或关闭所有加载动画
const startOrStopAllLoading = (bool: boolean) => {
  screenLoading.value = bool
  btnLoading.value = bool
}

// 抽屉关闭之前的回调
const drawerClose = async (done: (cancel?: boolean) => void) => {
  startOrStopAllLoading(true) // 开启loading动画
  const formValidate = await drawFormRef.value?.validate().catch((err: Error) => err)
  if (typeof formValidate === 'object') {
    //   表单校验未通过
    app?.$message({
      type: 'error',
      message: `请按提示完成表单内容的填写~`,
      duration: 3000
    })
    done(true) // 终止关闭
    startOrStopAllLoading(false)
    return
  }
  // 表单验证通过，进行注册操作
  const isValidate = await drawFormRef.value?.validate().catch((err: Error) => err)
  if (typeof isValidate !== 'object') {
    //   表单验证成功
    preRegistry()
    await registry(form)
    if (isLogin.value) {
      done(true)
      app?.$message({
        type: 'success',
        message: `注册成功！正在跳转到首页...`,
        duration: 2000
      })
      await router.push('/')
    }
  } else {
    app?.$message({
      type: 'error',
      message: `请完善未验证通过的表单项内容`,
      duration: 3000
    })
  }
  startOrStopAllLoading(false)
}

const onSubmit = async () => {
  // 进行基本表单校验
  startOrStopAllLoading(true)
  await validateFormFields(
    async () => {
      preRegistry()
      await registry(form)
      if (isLogin.value) {
        app?.$message({
          type: 'success',
          message: `注册成功！正在跳转到首页...`,
          duration: 2000
        })
        await router.push('/')
      }
      startOrStopAllLoading(false)
    },
    () => {
      app?.$message({
        type: 'error',
        message: `请完善必填项内容`,
        duration: 3000
      })
      startOrStopAllLoading(false)
    }
  )
}

// 初始化系统自带头像
const setInitialAvatars = async () => {
  const links = await getAllInitialAvatar().then((res: API.ServerResponse) => res.data?.datas)
  sessionStorage.setItem(SessionStorageItemName.InitialAvatarLinks, JSON.stringify(links))
  initialAvatars.value = links
}

// 从本地数据恢复系统自带头像数据
const recoverInitialAvatars = () => {
  initialAvatars.value = JSON.parse(
    sessionStorage.getItem(SessionStorageItemName.InitialAvatarLinks)
  ) as Array<string>
}

// 获取验证码
const getCaptchaAsync = async () => {
  const val = await getCaptcha()
  captcha.value = val as unknown as HTMLElement
  sessionStorage.setItem(SessionStorageItemName.RegistryCaptcha, val as unknown as string)
}

// 按钮更换验证码
const btnGetCaptcha = async () => {
  await getCaptchaAsync()
  form.captcha = ''
}

onBeforeMount(async () => {
  const captchaData = sessionStorage.getItem(SessionStorageItemName.RegistryCaptcha)
  captchaData ? (captcha.value = captchaData as unknown as HTMLElement) : await getCaptchaAsync()
  if (sessionStorage.getItem(SessionStorageItemName.InitialAvatarLinks)) {
    recoverInitialAvatars()
  } else {
    // 首次加载注册表单
    await setInitialAvatars()
  }
})
</script>

<template>
  <el-scrollbar>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="loginFormOrRegistryForm"
      label-width="80"
      label-position="left"
      status-icon
      v-loading.fullscreen="screenLoading"
      element-loading-text="正在注册中，请稍后......"
      element-loading-background="rgb(39 82 92 / 54%)"
    >
      <el-form-item :prop="ValidateRegistryEnum.Type" :required="true" label="角色">
        <el-select v-model="form.type" placeholder="请选择您的角色">
          <el-option
            v-for="item in userTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :prop="ValidateRegistryEnum.NickName" :required="true" label="昵称">
        <el-input
          v-model="form.nickname"
          :clearable="true"
          placeholder="请填写昵称"
          autocomplete="on"
          autofocus
        />
      </el-form-item>

      <el-form-item required :prop="ValidateRegistryEnum.Phone" label="手机号">
        <el-input
          v-model="form.phone"
          :clearable="true"
          placeholder="请填写手机号"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item :prop="ValidateRegistryEnum.LoginPwd" :required="true" label="密码">
        <el-input
          v-model="form.loginPwd"
          :clearable="true"
          :show-password="true"
          placeholder="请填写密码"
          type="password"
        />
      </el-form-item>

      <el-form-item :prop="ValidateRegistryEnum.ConfirmPwd" :required="true" label="确认密码">
        <el-input
          v-model="form.confirmPwd"
          :clearable="true"
          :show-password="true"
          placeholder="请再次填写相同的密码"
          type="password"
        />
      </el-form-item>

      <el-form-item
        :prop="ValidateRegistryEnum.Captcha"
        :required="true"
        class="alignCenter"
        label="验证码"
      >
        <el-col :span="6">
          <el-input v-model="form.captcha" :clearable="true" placeholder="请填写验证码" />
        </el-col>

        <el-col :span="1"></el-col>

        <el-col :span="6">
          <div class="captchaContainer" v-html="captcha" />
        </el-col>

        <el-col :span="1"></el-col>

        <el-col :span="9">
          <div>
            <get-captcha-index
              :storage="false"
              :storage-item-name="SessionStorageItemName.RegistryCaptchaValidateTime"
              :on-change="btnGetCaptcha"
            />
          </div>
        </el-col>
      </el-form-item>

      <el-form-item key="settingMore">
        <el-switch
          :inline-prompt="true"
          active-text="取消设置更多信息"
          inactive-text="是否设置更多注册信息"
          @change="moreSettingSwitchChange"
        >
          设置更多注册信息
        </el-switch>
      </el-form-item>

      <el-form-item :key="ValidateRegistryEnum.SaveTime">
        <el-row>
          <el-col :span="10">
            <el-switch
              v-model="useAutoLogin"
              :inline-prompt="true"
              active-text="请选择免登录时间"
              inactive-text="是否开启免登录"
              >开启免登录
            </el-switch>
          </el-col>
          <el-col :span="12">
            <el-select v-if="useAutoLogin" v-model="form.saveTime" placeholder="请选择免登录时间">
              <el-option
                v-for="item in autoLoginOptions"
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
          <el-button class="btnCenter" @click="onSubmit" :loading-icon="Star" :loading="btnLoading"
            >注册</el-button
          >
        </el-col>
      </el-form-item>

      <el-link class="changeFormBtn" @click="changeType">
        <el-text class="txt">登录</el-text>
      </el-link>
    </el-form>

    <el-drawer v-model="useMoreSettings" :before-close="drawerClose" :size="600">
      <el-form
        ref="drawFormRef"
        :model="form"
        :rules="rules"
        label-width="80"
        label-position="left"
        status-icon
      >
        <el-form-item :prop="ValidateRegistryEnum.Avatar" class="labelCenter" label="头像">
          <el-row class="avatarRow">
            <el-col :span="4">
              <AvatarUploadIndex
                :on-success="avatarUploadSuccess"
                :upload-options="{ disabled: !useUploadAvatar }"
                class="hvr-bob"
              >
                <template #default>
                  <el-avatar :src="form.avatar" />
                </template>
              </AvatarUploadIndex>
            </el-col>

            <el-col :span="20">
              <ul class="initialAvatarContainer" @click="initialAvatarClick">
                <el-avatar
                  v-for="item in initialAvatars"
                  :src="item"
                  class="hvr-shrink"
                  :key="item"
                />
              </ul>
            </el-col>

            <el-col>
              <el-switch
                v-model="useUploadAvatar"
                active-text="点击头像上传自己的头像"
                inactive-text="使用系统自带头像"
              />
            </el-col>

            <el-col>
              <el-text size="small" type="info">如果不选，将设置随机的系统头像</el-text>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Mail" label="邮箱">
          <el-input
            v-model="form.mail"
            :clearable="true"
            placeholder="请填写邮箱"
            autofocus
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.QQ" label="QQ号">
          <el-input
            v-model="form.qq"
            :clearable="true"
            placeholder="请填写QQ号"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Wechat" label="微信号">
          <el-input
            v-model="form.wechat"
            :clearable="true"
            placeholder="请填写微信号"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Intro" label="个人介绍">
          <el-input
            v-model="form.intro"
            :clearable="true"
            placeholder="请填写个人介绍"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Address" label="地址">
          <district-cascade-index :cascade-set="cascadeSet" :cascade-get="cascadeGet" />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.BirthDay" label="生日">
          <el-date-picker
            v-model="form.birthDay"
            :clearable="true"
            placeholder="请选择生日"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-scrollbar>
</template>

<style lang="less" scoped>
.initialAvatarContainer {
  padding: 0;
  display: flex;
  justify-content: space-evenly;
}

.avatarRow {
  margin-top: -5px;
}
</style>
