<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { getCurrentInstance, onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getCaptcha, validateCaptcha } from '@/api/captcha'
import CountDown from '@/components/CounDown.vue'
import { SessionStorageItemName, ValidateRegistryEnum } from '@/types/enum'
import { FormInstance, FormItemRule, FormRules } from 'element-plus'
import { MessageOptions } from 'element-plus/lib/components'
import { getAllInitialAvatar } from '@/api/image'
import AvatarUploadIndex from '@/components/AvatarUpload/AvatarUploadIndex.vue'
import { get as _get, last as _last } from 'lodash'
import { getDistrict } from '@/api/three-party'
import { GD_WEB_API_DISTRICT } from '@/types/thirty-party'
import { v4 as uuid } from 'uuid'

const { changeType } = defineProps<{ changeType: () => void }>()

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
  addr: '10000',
  phone: '',
  birthDay: 0,
  lastLoginDate: 0,
  loginId: uuid()
}) // 注册表单数据

// 设置四级联动选择框内容
const canscaderSet = reactive({
  province: '', // 选择的省份
  city: '', // 选择的城市
  district: '', // 选择的区县/街道
  street: ''
})

// 获取四级联动选择框内容
const canscaderGet = reactive({
  province: '', // 选择的省份
  city: '', // 选择的城市
  district: '', // 选择的区县/街道
  street: ''
})

// 地址级联选择器的选项
const canscaderOptions = reactive({
  province: [],
  city: [],
  district: [],
  street: []
})

// 是否正在加载省市级区数据
const fetchDistricts = reactive({
  province: false,
  city: false,
  district: false,
  street: false
})

const router = useRouter()
const { registry } = useUserStore()
const { isLogin } = storeToRefs(useUserStore())
const app = getCurrentInstance()?.appContext.config.globalProperties
const countDownTime = ref<number>(0) // 重新获取验证码的倒计时时间
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

const formRef = ref<FormInstance>()
const drawFormRef = ref<FormInstance>() // 抽屉注册表单ref

// 用于简单的校验器
const simpleValidatorFunc = (result: (value: any) => boolean, message) => {
  return (rule: FormItemRule, value: string, callback: (error?: string | Error) => void) => {
    if (result(value)) {
      callback()
    } else {
      callback(message)
    }
  }
}

// 校验器
const formValidators = {
  qq: /^(\d{5,11}|'')$/,
  wechat: /^([a-zA-Z][\w-]{5,19}|'')$/,
  password: /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~!@#$%^&*.-])[a-zA-Z\d!#@*&.-]{8,32}/,
  addr: /^([0-9]+-){1,2}[0-9]+$/,
  phone: /^(1[3-9][0-9]{9}|'')$/,
  url: /(http|https):\/\/\w+((:\d{2,})|(.\w+)+)(\/[\w_]+)*(\/[\w_.]+\.(jpg|png|webp|bmp|gif|svg))/,
  mail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
}

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
        '密码格式不对，请重新填写'
      ),
      trigger: ['blur']
    }
  ],
  confirmPwd: [
    { required: true, message: '请输入密码' },
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
    { len: 6, message: '请正确输入验证码，正确输入后自动登录哦' },
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

const totalDistricts = ref<GD_WEB_API_DISTRICT>([]) // 全部的省市区县数据

/**
 * 解析省市级列表，获取需要的值，生成多级联动
 * @param districts 省市级数据
 * @param beginVal 开始的值
 * @param keys 需要设置的key country city district street
 * @param callBack 完成解析后的回调
 */
const parseDistrictToArraySingle = (
  districts: GD_WEB_API_DISTRICT[] | undefined,
  beginVal: string | undefined,
  keys: string[],
  callBack: (item: GD_WEB_API_DISTRICT | undefined, districts: GD_WEB_API_DISTRICT[]) => void
) => {
  if (!districts || !beginVal) {
    return
  }
  let findItem = districts.find((i) => i.adcode === beginVal)
  if (findItem) {
    const reduce = keys.reduce(
      ({ districts, values }, cur, currentIndex) => {
        const obj = {
          districts: [...districts],
          values: [...values]
        }
        if (cur !== 'street') {
          // 计算下一个选择框的值
          try {
            obj.values.push(_last(districts)[0].districts[0])
          } finally {
            obj.districts.push(_last(districts)[0].districts)
          }
        }
        if (currentIndex === 0) {
          obj.districts.shift()
        }
        return obj
      },
      { districts: [[findItem]], values: [] }
    )
    reduce.values.forEach((i, ind) => callBack(i, reduce.districts[ind]))
  } else {
    //   该层没有需要的数据跳过
    parseDistrictToArraySingle(
      districts.find((i) => i.adcode.startsWith(beginVal.slice(0, 2)))?.districts,
      beginVal,
      keys,
      callBack
    )
  }
}

/**
 * 解析省市级列表，获取需要的值
 */
const parseDistrictToTotalArray = (
  districts: GD_WEB_API_DISTRICT[] | undefined,
  beginVal: string | undefined,
  key: string,
  callBack: (list: GD_WEB_API_DISTRICT[]) => void
) => {
  if (!districts || !beginVal) {
    return
  }
  let findItem = districts.find((i) => i.adcode === beginVal)
  if (findItem) {
    callBack(findItem.districts)
  } else {
    //   该层没有需要的数据跳过
    parseDistrictToTotalArray(
      districts.find((i) => i.adcode.startsWith(beginVal.slice(0, 2)))?.districts,
      beginVal,
      key,
      callBack
    )
  }
}

// 远程获取选择器数据
const remote = async () => {
  const districtStr = sessionStorage.getItem(SessionStorageItemName.GdWebApiDistrict)
  if (districtStr) {
    totalDistricts.value = JSON.parse(districtStr) as GD_WEB_API_DISTRICT
  } else {
    let res = await getDistrict()
    res = res.districts
    totalDistricts.value = res
    sessionStorage.setItem(SessionStorageItemName.GdWebApiDistrict, JSON.stringify(res))
  }
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

// 行政区选择器文本输入事件
const onDistrictInp = (prevValue: string, curLevel: string) => {
  return async (val: string) => {
    // 没有数据，获取全部数据
    // 正在获取数据
    fetchDistricts[curLevel] = true
    if (!canscaderOptions[curLevel].length) {
      parseDistrictToTotalArray(totalDistricts.value, prevValue, curLevel, (list) => {
        canscaderOptions[curLevel] = list
      })
    }
    if (val) {
      // 当前的搜索有值，筛选已经存在的结果
      canscaderOptions[curLevel] = canscaderOptions[curLevel].filter((i) => i.name.includes(val))
    }
    // 数据获取完毕
    fetchDistricts[curLevel] = false
  }
}

// 行政区选择器选中值改变事件
const onDistrictSelectChange = async (value: string, curLevel: string, nextLevels: string[]) => {
  // 先清空之前的数据
  nextLevels.forEach((i) => {
    canscaderSet[i] = canscaderGet[i] = ''
    canscaderOptions[i] = []
  })
  const curAdcode = canscaderOptions[curLevel].find((i) => i.center === value)?.adcode
  canscaderGet[curLevel] = curAdcode
  parseDistrictToArraySingle(
    canscaderOptions[curLevel],
    curAdcode,
    nextLevels,
    (item, districts) => {
      canscaderOptions[item.level] = districts
      canscaderSet[item.level] = item.center
      canscaderGet[item.level] = item.adcode
    }
  )
}

// 行政区选择器下拉框出现/隐藏时触发的事件
const onDistrictSelectVisableChange = async (
  preValue: string,
  value: boolean,
  curLevel: string
) => {
  if (value && !canscaderOptions[curLevel].length) {
    // 下拉框显示，并且没有数据，获取数据
    // 开始加载数据
    fetchDistricts[curLevel] = true
    parseDistrictToTotalArray(totalDistricts.value, preValue, curLevel, (list) => {
      canscaderOptions[curLevel] = list
      // 数据加载完毕
      fetchDistricts[curLevel] = false
    })
  }
}

// 日期选择框判断该日期是否被禁用
const disabledDate = (d: Date) => d.getFullYear() < 1960

// 进行注册前的预处理动作
const preRegistry = () => {
  form.addr = [
    `${canscaderGet.province}/${canscaderSet.province}`,
    `${canscaderGet.city}/${canscaderSet.city}`,
    `${canscaderGet.district}/${canscaderSet.district}`,
    `${canscaderGet.street}/${canscaderSet.street}`
  ]
    .filter((i) => i.length > 1)
    .join('-')
  !form.qq && (form.qq = ' ')
  !form.wechat && (form.wechat = ' ')
  !form.mail && (form.mail = ' ')
  !form.phone && (form.phone = ' ')
  if (typeof form.birthDay !== 'number') {
    // 当前为日期对象
    form.birthDay = form.birthDay.getTime()
  }
  form.lastLoginDate = new Date().getTime()
}

// 抽屉关闭之前的回调
const drawerClose = async (done: (cancel?: boolean) => void) => {
  const formValidate = await drawFormRef.value?.validate().catch((err: Error) => err)
  if (typeof formValidate === 'object') {
    //   表单校验未通过
    app?.$message({
      type: 'error',
      message: `请按提示完成表单内容的填写~`,
      duration: 3000
    })
    done(true) // 终止关闭
    return
  }
  // 表单验证通过，进行注册操作
  const isValidate = await drawFormRef.value?.validate().catch((err: Error) => err)
  if (typeof isValidate !== 'object') {
    //   表单验证成功
    preRegistry()
    const res = await registry(form)
    if (isLogin.value) {
      done(true)
      app?.$message({
        type: 'success',
        message: `注册成功！即将跳转到首页...`,
        duration: 2000
      })
      await router.push('/')
    } else {
      app?.$message({
        type: 'error',
        message: `很遗憾，注册失败！${res.msg ?? ''}`,
        duration: 3000
      })
    }
  } else {
    app?.$message({
      type: 'error',
      message: `请完善未验证通过的表单项内容`,
      duration: 3000
    })
  }
}

const onSubmit = async () => {
  // 进行基本表单校验
  await validateFormFields(
    async () => {
      const res = await registry(form)
      if (isLogin.value) {
        app?.$message({
          type: 'success',
          message: `注册成功！即将跳转到首页...`,
          duration: 2000
        })
        await router.push('/')
      } else {
        app?.$message({
          type: 'error',
          message: `很遗憾，注册失败！${res.msg ?? ''}`,
          duration: 3000
        })
      }
    },
    () =>
      app?.$message({
        type: 'error',
        message: `请完善必填项内容`,
        duration: 3000
      })
  )
}

// 计时器组件时间改变回调
const onCountDownChange = (time: number) => {
  countDownTime.value = time
}

// 重置验证码验证剩余时间
const resetCountDownTime = () => {
  const val = Date.now() + 1000 * 120
  sessionStorage.setItem(SessionStorageItemName.RegistryCaptchaValidateTime, `${val}`)
  countDownTime.value = Math.floor((val - Date.now()) / 1000)
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
  resetCountDownTime()
  await getCaptchaAsync()
  form.captcha = ''
}

onBeforeMount(async () => {
  remote().then(() => console.log('获取省市级区列表数据成功'))
  const captchaData = sessionStorage.getItem(SessionStorageItemName.RegistryCaptcha)
  captchaData ? (captcha.value = captchaData as unknown as HTMLElement) : await getCaptchaAsync()
  if (sessionStorage.getItem(SessionStorageItemName.InitialAvatarLinks)) {
    recoverInitialAvatars()
  } else {
    // 首次加载注册表单
    await setInitialAvatars()
  }
  if (sessionStorage.getItem(SessionStorageItemName.RegistryCaptchaValidateTime)) {
    let val =
      +(sessionStorage.getItem(SessionStorageItemName.RegistryCaptchaValidateTime) as string) -
      Date.now()
    if (val < 0) {
      val = 0
    } else {
      val = Math.floor(val / 1000)
    }
    countDownTime.value = val
  } else {
    // 第一次加载
    resetCountDownTime()
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
        <el-input v-model="form.nickname" :clearable="true" placeholder="请填写昵称" />
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
            <el-button v-if="countDownTime" :disabled="true" type="info">
              <count-down :on-change="onCountDownChange" :time="countDownTime" />
              <el-text>&nbsp;秒后重新获取验证码</el-text>
            </el-button>
            <el-button v-else type="primary" @click="btnGetCaptcha">
              <el-text>请重新获取验证码</el-text>
            </el-button>
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
        <el-button class="btnCenter" @click="onSubmit">注册</el-button>
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
                <el-avatar v-for="item in initialAvatars" :src="item" class="hvr-shrink" />
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
          <el-input v-model="form.mail" :clearable="true" placeholder="请填写邮箱" />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.QQ" label="QQ号">
          <el-input v-model="form.qq" :clearable="true" placeholder="请填写QQ号" />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Wechat" label="微信号">
          <el-input v-model="form.wechat" :clearable="true" placeholder="请填写微信号" />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Intro" label="个人介绍">
          <el-input v-model="form.intro" :clearable="true" placeholder="请填写个人介绍" />
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Address" label="地址">
          <el-row class="flexFullBasis">
            <el-col>
              <el-row justify="space-evenly">
                <el-text>省份</el-text>
                <el-select
                  v-model="canscaderSet.province"
                  :remote="true"
                  :filterable="true"
                  @visible-change="(value:boolean) =>onDistrictSelectVisableChange( '100000',value,'province')"
                  :remote-method="onDistrictInp('100000', 'province')"
                  @change="(value:string) => onDistrictSelectChange(value, 'province', ['city','district','street'])"
                  :clearable="true"
                  placeholder="请选择省份"
                  :loading="fetchDistricts.province"
                  loading-text="正在加载省份数据，请稍后······"
                >
                  <el-option
                    v-for="item in canscaderOptions.province"
                    :key="item.name"
                    :label="item.name"
                    :value="item.center"
                  />
                </el-select>
              </el-row>
            </el-col>

            <el-divider class="mg-10"></el-divider>

            <el-col>
              <el-row justify="space-evenly">
                <el-text>城市</el-text>
                <el-select
                  v-model="canscaderSet.city"
                  :disabled="!canscaderSet.province"
                  :remote="true"
                  :filterable="true"
                  @visible-change="(value:boolean) =>onDistrictSelectVisableChange(canscaderGet.province, value,'city')"
                  :remote-method="onDistrictInp(canscaderGet.province, 'city')"
                  @change="(value:string) => onDistrictSelectChange(value, 'city', ['district','street'])"
                  :clearable="true"
                  placeholder="请选择城市"
                  :loading="fetchDistricts.city"
                  loading-text="正在加载城市数据，请稍后······"
                >
                  <el-option
                    v-for="item in canscaderOptions.city"
                    :key="item.name"
                    :label="item.name"
                    :value="item.center"
                  />
                </el-select>
              </el-row>
            </el-col>

            <el-divider class="mg-10"></el-divider>

            <el-col>
              <el-row justify="space-evenly">
                <el-text>区县</el-text>
                <el-select
                  v-model="canscaderSet.district"
                  :disabled="!canscaderOptions.district.length && !canscaderSet.district"
                  :remote="true"
                  :filterable="true"
                  @visible-change="(value:boolean) =>onDistrictSelectVisableChange(canscaderGet.city,value,'district')"
                  :remote-method="onDistrictInp(canscaderGet.city, 'district')"
                  @change="(value:string) => onDistrictSelectChange(value, 'district', ['street'])"
                  :clearable="true"
                  :placeholder="
                    !canscaderOptions.district.length && !canscaderSet.district
                      ? '当前区域没有区县这一分类'
                      : '请选择区县'
                  "
                  :loading="fetchDistricts.district"
                  loading-text="正在加载区县数据，请稍后······"
                >
                  <el-option
                    v-for="item in canscaderOptions.district"
                    :key="item.name"
                    :label="item.name"
                    :value="item.center"
                  />
                </el-select>
              </el-row>
            </el-col>

            <el-divider class="mg-10"></el-divider>

            <el-col>
              <el-row justify="space-evenly">
                <el-text>街道</el-text>
                <el-select
                  v-model="canscaderSet.street"
                  :disabled="!canscaderOptions.street.length && !canscaderSet.street"
                  :remote="true"
                  :filterable="true"
                  @visible-change="(value:boolean) =>onDistrictSelectVisableChange(canscaderGet.district,value,'street')"
                  :remote-method="onDistrictInp(canscaderGet.district, 'street')"
                  :clearable="true"
                  :placeholder="
                    !canscaderOptions.street.length && !canscaderSet.street
                      ? '当前区域没有街道这一分类'
                      : '请选择街道'
                  "
                  :loading="fetchDistricts.street"
                  loading-text="正在加载街道数据，请稍后······"
                >
                  <el-option
                    v-for="item in canscaderOptions.street"
                    :key="item.name"
                    :label="item.name"
                    :value="item.center"
                  />
                </el-select>
              </el-row>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item :prop="ValidateRegistryEnum.Phone" label="手机号">
          <el-input v-model="form.phone" :clearable="true" placeholder="请填写手机号" />
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
@import url(../../styles/minix);

.initialAvatarContainer {
  padding: 0;
  display: flex;
  justify-content: space-evenly;
}

.avatarRow {
  margin-top: -5px;
}
</style>
