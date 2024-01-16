<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { getCurrentInstance, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptcha, validateCaptcha } from '@/api/captcha'
import { SessionStorageItemName, ValidateRegistryEnum } from '@/types/enum'
import { getAllInitialAvatar } from '@/api/image'
import { findSingleUser } from '@/utils/api'
import AvatarUploadIndex from '@/components/AvatarUpload/AvatarUploadIndex.vue'
import { get as _get } from 'lodash'
import { v4 as uuid } from 'uuid'
import { formValidators } from '@/utils/validate'
import GetCaptchaIndex from '@/components/GetCaptcha/GetCaptchaIndex.vue'
import DistrictCascadeIndex from '@/components/DistrictCascader/DistrictCascadeIndex.vue'
import { simpleValidatorFunc } from '@/utils/validate'
import {
  MessageOptions,
  FormRules,
  FormInst,
  FormItemRule,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NGi,
  NFormItemGi,
  NScrollbar,
  NSwitch,
  NText,
  NButton,
  NGrid,
  NDrawer,
  NAvatar,
  NAvatarGroup,
  NDatePicker,
  NSpace,
  NIcon,
  AvatarProps
} from 'naive-ui'
import CountDown from '@/components/CounDown.vue'
import { StarHalfSharp } from '@vicons/ionicons5'

const props = defineProps<{ changeType: () => void }>()

const { changeType } = toRefs(props)

/**
 * data定义
 */
const form = ref<API.User.Add & { captcha: string; saveTime: number; confirmPwd: string }>({
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
  birthDay: Date.now(),
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

// 用户类型
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

const initialAvatars = ref<Array<AvatarProps>>([]) // 系统自带的头像列表

const getTimeRef = ref<{ [key: string]: any }>()

const useAutoLogin = ref<boolean>(false) // 是否启用免登录
const useMoreSettings = ref<boolean>(false) // 是否设置更多注册信息
const useUploadAvatar = ref<boolean>(false) // 是否上传自己的头像

const screenLoading = ref<boolean>(false) // 是否加载全屏过渡动画
const btnLoading = ref<boolean>(false) // 是否按钮加载过渡动画

// 验证当前表单项是否已经有相应用户了
const validateIsBind: (key: string, message: string) => FormItemRule = (key, message) => ({
  asyncValidator: (_: FormItemRule, val: string) =>
    new Promise(async (resolve, reject) => {
      const user = await findSingleUser({ [key]: val })
      if (user) {
        reject(message)
      } else {
        resolve()
      }
    }),
  trigger: ['blur']
})

const formRef = ref<FormInst>()
const drawFormRef = ref<FormInst>() // 抽屉注册表单ref

const rules = ref<FormRules>({
  [ValidateRegistryEnum.NickName]: [
    { required: true, message: '请填写昵称', trigger: ['input', 'blur'] },
    { min: 2, max: 10, message: '昵称的长度为2-10位', trigger: ['blur'] },
    validateIsBind(ValidateRegistryEnum.NickName, '当前昵称已被他人注册')
  ],
  [ValidateRegistryEnum.LoginPwd]: [
    { required: true, message: '请填写密码', trigger: ['input', 'blur'] },
    { min: 8, message: '密码不能小于8位', trigger: ['blur'] },
    { max: 32, message: '密码不能超过32位', trigger: ['blur'] },
    {
      validator: simpleValidatorFunc((value: string) => formValidators.password.test(value)),
      message: '密码要求数字、字母加特殊字符',
      trigger: ['blur']
    }
  ],
  [ValidateRegistryEnum.ConfirmPwd]: [
    { required: true, message: '请再次输入密码', trigger: ['input', 'blur'] },
    {
      validator: simpleValidatorFunc((value: string) => value === form.value.loginPwd),
      message: '两次输入的密码不一致，请检查',
      trigger: ['blur']
    }
  ],
  [ValidateRegistryEnum.Captcha]: [
    { required: true, message: '请填写验证码', trigger: ['input', 'blur'] },
    { len: 6, message: '请正确输入验证码', trigger: ['blur'] },
    {
      asyncValidator: (_: FormItemRule, value: string) =>
        new Promise((resolve, reject) => {
          validateCaptcha({ captcha: value }).then(
            (res: API.ServerResponse) => {
              if (res.code !== 200) {
                reject(res.msg)
              }
              resolve()
            },
            (err: Error) => {
              reject(err.message)
            }
          )
        }),
      trigger: ['blur']
    }
  ],
  [ValidateRegistryEnum.Mail]: [
    {
      validator: simpleValidatorFunc((value) => (value ? formValidators.mail.test(value) : true)),
      message: '邮箱格式不对，请重新输入',
      trigger: ['blur']
    },
    validateIsBind(ValidateRegistryEnum.Mail, '当前邮箱已被他人绑定')
  ],
  [ValidateRegistryEnum.QQ]: [
    {
      validator: simpleValidatorFunc((value: string) =>
        value ? formValidators.qq.test(value) : true
      ),
      message: 'QQ号格式不对，请重新输入',
      trigger: ['blur']
    },
    validateIsBind(ValidateRegistryEnum.QQ, '当前qq号已被他人绑定')
  ],
  [ValidateRegistryEnum.Wechat]: [
    {
      validator: simpleValidatorFunc((value: string) =>
        value ? formValidators.wechat.test(value) : true
      ),
      message: '微信号格式不对，请重新输入',
      trigger: ['blur']
    },
    validateIsBind(ValidateRegistryEnum.Wechat, '当前微信号已被他人绑定')
  ],
  [ValidateRegistryEnum.Phone]: [
    { required: true, message: '请填写手机号', trigger: ['input', 'blur'] },
    {
      validator: simpleValidatorFunc((value: string) =>
        value ? formValidators.phone.test(value) : true
      ),
      message: '手机号格式不对，请重新输入',
      trigger: ['blur']
    },
    validateIsBind(ValidateRegistryEnum.Phone, '当前手机号已被他人绑定')
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
        app?.$message(`请先完善必填项再填写更多注册信息~`, {
          type: 'error',
          duration: 3000
        })
    )
  }
}

// 头像上传成功
const avatarUploadSuccess = (response: API.ServerResponse) => {
  form.value.avatar = response.data as unknown as string
  app.$message('恭喜您，头像上传成功', {
    type: 'success'
  } as MessageOptions)
}

// 系统自定义头像点击事件
const initialAvatarClick = (e: any) => {
  const src = _get(e, 'target.src')
  src && (form.value.avatar = src)
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
const disabledDate = (d: number) => new Date(d).getFullYear() < 1960

// 进行注册前的预处理动作
const preRegistry = () => {
  if (!useAutoLogin.value) {
    //   未开启免登录，将免登录时间改为0
    form.value.saveTime = 0
  }
  let addresses = [
    `${cascadeGet.province}/${cascadeSet.province}`,
    `${cascadeGet.city}/${cascadeSet.city}`,
    `${cascadeGet.district}/${cascadeSet.district}`,
    `${cascadeGet.street}/${cascadeSet.street}`
  ].filter((i) => i.length > 1)
  if (addresses.length) {
    form.value.addr = [
      `${cascadeGet.province}/${cascadeSet.province}`,
      `${cascadeGet.city}/${cascadeSet.city}`,
      `${cascadeGet.district}/${cascadeSet.district}`,
      `${cascadeGet.street}/${cascadeSet.street}`
    ]
      .filter((i) => i.length > 1)
      .join('-')
  }
}

// 开启或关闭所有加载动画
const startOrStopAllLoading = (bool: boolean) => {
  screenLoading.value = bool
  btnLoading.value = bool
}

// 有进行注册的权限
const accessToRegistry = async (successCallback?: () => void) => {
  preRegistry()
  await registry(form.value)
  if (isLogin.value) {
    successCallback && successCallback()
    app?.$message(`注册成功！正在跳转到首页...`, {
      type: 'success',
      duration: 2000
    })
    await router.push('/')
  }
  startOrStopAllLoading(false)
}

// 抽屉显示状态改变时执行的回调函数
const drawerUpdateShow = async (cancel: boolean) => {
  if (cancel) {
    return
  }
  startOrStopAllLoading(true) // 开启loading动画
  const formValidate = await drawFormRef.value?.validate().catch((err: Error) => err)
  if (typeof formValidate === 'object') {
    //   表单校验未通过
    app?.$message(`请按提示完成表单内容的填写~`, {
      type: 'error',
      duration: 3000
    })
    startOrStopAllLoading(false)
    return
  }
  // 表单验证通过，进行注册操作
  await accessToRegistry(() => {
    useMoreSettings.value = false
  })
}

const onSubmit = async () => {
  // 进行基本表单校验
  startOrStopAllLoading(true)
  await validateFormFields(accessToRegistry, () => {
    app?.$message(`请完善必填项内容`, {
      type: 'error',
      duration: 3000
    })
    startOrStopAllLoading(false)
  })
}

// 初始化系统自带头像
const setInitialAvatars = async () => {
  const links = await getAllInitialAvatar().then((res: API.ServerResponse) =>
    (res.data?.datas as Array<string>).map((i) => ({
      round: true,
      src: i
    }))
  )
  sessionStorage.setItem(SessionStorageItemName.InitialAvatarLinks, JSON.stringify(links))
  initialAvatars.value = links
}

// 从本地数据恢复系统自带头像数据
const recoverInitialAvatars = () => {
  initialAvatars.value = JSON.parse(
    sessionStorage.getItem(SessionStorageItemName.InitialAvatarLinks)
  ) as Array<AvatarProps>
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
  form.value.captcha = ''
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
  <div>
    <n-scrollbar>
      <n-form
        ref="formRef"
        class="loginFormOrRegistryForm"
        label-width="80"
        :model="form"
        :rules="rules"
        require-mark-placement="left"
      >
        <n-form-item :path="ValidateRegistryEnum.Type" required label="角色">
          <n-select
            v-model:value="form.type"
            placeholder="请选择您的角色"
            :options="userTypeOptions"
          />
        </n-form-item>

        <n-form-item first :path="ValidateRegistryEnum.NickName" required label="昵称">
          <n-input
            v-model:value="form.nickname"
            placeholder="请填写昵称"
            autofocus
            clearable
            :input-props="{ autocomplete: 'on' }"
          />
        </n-form-item>

        <n-form-item first required :path="ValidateRegistryEnum.Phone" label="手机号">
          <n-input
            v-model:value="form.phone"
            placeholder="请填写手机号"
            clearable
            :input-props="{ autocomplete: 'on' }"
          />
        </n-form-item>

        <n-form-item first :path="ValidateRegistryEnum.LoginPwd" required label="密码">
          <n-input
            v-model:value="form.loginPwd"
            clearable
            show-password-on="click"
            placeholder="请填写密码"
            type="password"
          />
        </n-form-item>

        <n-form-item first :path="ValidateRegistryEnum.ConfirmPwd" required label="确认密码">
          <n-input
            v-model:value="form.confirmPwd"
            show-password-on="click"
            placeholder="请再次填写相同的密码"
            type="password"
            clearable
          />
        </n-form-item>

        <n-form-item
          first
          :path="ValidateRegistryEnum.Captcha"
          clearable
          required
          class="alignCenter"
          label="验证码"
        >
          <n-grid class="gridCenter">
            <n-gi :span="8">
              <n-input
                v-model:value="form.captcha"
                placeholder="请填写验证码"
                clearable
                :input-props="{ autocomplete: 'on' }"
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
                :storage-item-name="SessionStorageItemName.RegistryCaptchaValidateTime"
              >
                <template #activeContent="{ countChange, countTime }">
                  <n-button disabled type="info" class="registryFormCaptchaBtn">
                    <count-down :on-change="countChange" :time="countTime" />
                    <n-text>&nbsp;秒后自动获取验证码</n-text>
                  </n-button>
                </template>
                <template #finishContent="{ clickFunc }">
                  <n-button class="registryFormCaptchaBtn" type="primary" @click="clickFunc">
                    <n-text>获取验证码</n-text>
                  </n-button>
                </template>
              </get-captcha-index>
            </n-gi>
          </n-grid>
        </n-form-item>

        <n-switch @update-value="moreSettingSwitchChange" :value="useMoreSettings">
          <template #checked>
            <n-text>取消设置更多信息</n-text>
          </template>
          <template #unchecked>
            <n-text>设置更多注册信息</n-text>
          </template>
        </n-switch>

        <n-grid>
          <n-form-item-gi :span="7">
            <n-switch v-model:value="useAutoLogin"
              ><template #checked>
                <n-text>请选择免登录时间</n-text>
              </template>
              <template #unchecked>
                <n-text>开启免登录</n-text>
              </template>
            </n-switch>
          </n-form-item-gi>
          <n-form-item-gi :span="7">
            <n-select
              v-if="useAutoLogin"
              v-model:value="form.saveTime"
              placeholder="请选择免登录时间"
              :options="autoLoginOptions"
            />
          </n-form-item-gi>
        </n-grid>

        <n-button class="btnCenter" @click="onSubmit" :loading="btnLoading">
          <template #default>
            <n-text>注册</n-text>
          </template>
          <template #icon v-if="btnLoading">
            <n-icon>
              <star-half-sharp />
            </n-icon>
          </template>
        </n-button>

        <div class="changeFormBtn" @click="changeType">
          <n-text class="txt">登录</n-text>
        </div>
      </n-form>

      <n-drawer
        :show="useMoreSettings"
        @update-show="drawerUpdateShow"
        default-width="600"
        :content-style="{ paddingRight: 20 + 'px', paddingTop: '20px' }"
      >
        <n-form
          ref="drawFormRef"
          label-width="80"
          label-placement="left"
          :model="form"
          :rules="rules"
        >
          <n-form-item :path="ValidateRegistryEnum.Avatar" class="labelCenter" label="头像">
            <n-space>
              <n-grid>
                <n-gi :span="6">
                  <AvatarUploadIndex
                    :on-success="avatarUploadSuccess"
                    :upload-options="{ disabled: !useUploadAvatar }"
                    class="hvr-bob"
                  >
                    <template #default>
                      <n-avatar :src="form.avatar">
                        <template #placeholder>加载头像</template>
                      </n-avatar>
                    </template>
                  </AvatarUploadIndex>
                </n-gi>

                <n-gi :span="18">
                  <n-avatar-group :options="initialAvatars" @click="initialAvatarClick" />
                </n-gi>
              </n-grid>
              <div>
                <n-switch v-model:value="useUploadAvatar">
                  <template #checked>
                    <n-text>使用系统自带头像</n-text>
                  </template>

                  <template #unchecked>
                    <n-text>点击头像上传自己的头像</n-text>
                  </template>
                </n-switch>
                <n-text class="mini-desc">如果不选，将设置随机的系统头像</n-text>
              </div>
            </n-space>
          </n-form-item>

          <n-form-item :path="ValidateRegistryEnum.Mail" label="邮箱">
            <n-input
              v-model:value="form.mail"
              clearable
              placeholder="请填写邮箱"
              autofocus
              :input-props="{ autocomplete: 'on' }"
            />
          </n-form-item>

          <n-form-item :path="ValidateRegistryEnum.QQ" label="QQ号">
            <n-input
              v-model:value="form.qq"
              clearable
              placeholder="请填写QQ号"
              :input-props="{ autocomplete: 'on' }"
            />
          </n-form-item>

          <n-form-item :path="ValidateRegistryEnum.Wechat" label="微信号">
            <n-input
              v-model:value="form.wechat"
              clearable
              placeholder="请填写微信号"
              :input-props="{ autocomplete: 'on' }"
            />
          </n-form-item>

          <n-form-item :path="ValidateRegistryEnum.Intro" label="个人介绍">
            <n-input
              v-model:value="form.intro"
              clearable
              placeholder="请填写个人介绍"
              :input-props="{ autocomplete: 'on' }"
            />
          </n-form-item>

          <n-form-item :path="ValidateRegistryEnum.Address" label="地址">
            <district-cascade-index :cascade-set="cascadeSet" :cascade-get="cascadeGet" />
          </n-form-item>

          <n-form-item :path="ValidateRegistryEnum.BirthDay" label="生日">
            <n-date-picker
              v-model:value="form.birthDay"
              clearable
              placeholder="请选择生日"
              :is-date-disabled="disabledDate"
            />
          </n-form-item>
        </n-form>
      </n-drawer>
    </n-scrollbar>
  </div>
</template>

<style lang="less" scoped>
.avatarRow {
  margin-top: -5px;
}

.txt {
  cursor: pointer;
}

.gridCenter {
  align-items: center;
}

.registryFormCaptchaBtn {
  min-width: 170px;
}

.mini-desc {
  font-size: 0.8rem;
  margin-left: 10px;
  color: gray;
}
</style>
