<script setup lang="ts">
import { ref, reactive, Component, getCurrentInstance } from 'vue'
import GetCaptchaIndex from '@/components/GetCaptcha/GetCaptchaIndex.vue'
import { SessionStorageItemName } from '@/types/enum'
import { decrypt } from '@/utils/encryptOrDecrypt'
import { getSingle, modify } from '@/api/user'
import { sentForgetMessage } from '@/api/three-party'
import { filterObj } from '@/utils'
import { useRouter } from 'vue-router'
import { simpleValidatorFunc, formValidators } from '@/utils/validate'
import type { FormInst, FormItemRule, FormRules, MessageOptions } from 'naive-ui'
import { HappyOutline } from '@vicons/ionicons5'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NForm,
  NFormItem,
  NInput,
  NGi,
  NFormItemGi,
  NText,
  NButton,
  NGrid,
  NSteps,
  NStep,
  NSpace,
  NResult,
  NIcon
} from 'naive-ui'
import type { TextProps } from 'naive-ui'
import CountDown from '@/components/CounDown.vue'

// 步骤条单项数据格式
declare interface StepItem {
  title: string
  description: string
  icon?: string | Component
  status: StepItemStatus
}

// 当前步骤的状态
const enum StepItemStatus {
  Wait = 'wait',
  Process = 'process',
  Finish = 'finish',
  Error = 'error'
}

const sentCaptcha = ref('') // 发送的短信验证码

const formRef = ref<FormInst>()

// 查找的表单项
const findFormValue = ref({
  loginId: '',
  phone: '',
  captcha: ''
})

const sentMsgBtnDisabled = ref<boolean>(true) // 获取验证码按钮是否处于禁用状态

const app = getCurrentInstance()?.appContext.config.globalProperties
const router = useRouter()

const TextThemeOverrides: NonNullable<TextProps['themeOverrides']> = {}

// 查找的表单校验规则
const findFormRules: FormRules = {
  loginId: [{ len: 36, message: '用户id为36位', trigger: ['blur'] }],
  phone: [
    {
      required: true,
      message: '请填写手机号',
      trigger: ['input']
    },
    { len: 11, message: '手机号位数不正确', trigger: ['blur', 'input'] },
    {
      validator: simpleValidatorFunc((value: string) =>
        formValidators.phone.test(value)
          ? !(sentMsgBtnDisabled.value = false)
          : !(sentMsgBtnDisabled.value = true)
      ),
      message: '手机号验证未通过',
      trigger: ['blur']
    }
  ],
  captcha: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: ['input']
    },
    {
      validator: simpleValidatorFunc((value: string) => value === sentCaptcha.value),
      message: '验证码有误，请重新检查或再次获取',
      trigger: ['blur']
    }
  ]
}

// 重置的表单项
const resetFormValue = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})

// 重置的表单校验规则
const resetFormRules = {
  newPwd: [
    { min: 8, message: '密码不能小于8位', trigger: ['blur'] },
    { max: 32, message: '密码不能超过32位', trigger: ['blur'] },
    {
      validator: (rule: FormItemRule, value: string) => {
        if (!formValidators.password.test(value)) {
          return new Error('密码要求数字、字母加特殊字符')
        }
        if (resetFormValue.value.oldPwd !== value) {
          return new Error('新密码不能与原密码相同')
        }
        return true
      },
      trigger: ['blur']
    }
  ],
  confirmPwd: [
    {
      validator: simpleValidatorFunc((value: string) => value === resetFormValue.value.newPwd),
      message: '两次输入的密码不一致，请检查',
      trigger: ['blur']
    }
  ]
}

const isReseted = ref<boolean>(false) // 判断是否进行了重置密码操作

const activeStep = ref<number>(2)
const steps = reactive<Array<StepItem>>([
  {
    title: '找回密码',
    description: '请填写相应内容',
    status: StepItemStatus.Process
  },
  {
    title: '重置密码',
    description: '如果继续使用原密码则可以跳过这步',
    status: StepItemStatus.Wait
  },
  {
    title: '跳转首页',
    description: '',
    status: StepItemStatus.Wait
  }
])

// 验证第一步表单
const validateFirst = async () => {
  let error = false
  await formRef.value?.validate().catch(() => (error = true))
  if (error) {
    //   表单验证成功
    const info: API.User.FindOne = {
      phone: findFormValue.value.phone
    }
    findFormValue.value.loginId && (info.loginId = findFormValue.value.loginId)
    const res = await getSingle(info)
    if (res.data) {
      resetFormValue.value.oldPwd = decrypt(res.data.loginPwd)
      steps[0].description = '旧密码已成功找到'
      return true
    } else {
      //   未找到对应的用户
      app?.$message(
        '未找到对应用户，请确保该用户已注册，4秒后自动跳转到注册页，如果关闭弹窗将拒绝跳转',
        {
          type: 'error',
          duration: 4000,
          onClose: (type: string | undefined) => {
            if (type && type === 'click') {
              //   取消去注册页
              return
            }
            router.push({ name: 'loginOrRegistry', state: { type: 'registry' } })
          }
        } as MessageOptions
      )
      steps[0].description = '未找到对应用户信息，请确保该用户已注册'
      return false
    }
  }
  steps[0].description = '表单验证未通过'
  return false
}

// 验证第二步表单
const validateSecond = async () => {
  if (!resetFormValue.value.newPwd) {
    // 未重置密码
    steps[1].description = '未进行重置密码操作'
    return true
  }
  //   进行表单验证
  let error = false
  await formRef.value?.validate().catch(() => (error = true))
  if (error) {
    // 表单验证失败
    steps[1].status = StepItemStatus.Error
    steps[1].description = '表单验证失败'
    return false
  }
  //   表单验证成功
  isReseted.value = true // 重置密码
  const res = await modify(filterObj(findFormValue.value, ['loginId', 'phone']), {
    loginPwd: filterObj(resetFormValue.value, ['newPwd']).newPwd
  })
  if (res.code === 200) {
    //   重置可能成功
    if (!res.data?.count) {
      //   重置未成功
      steps[1].status = StepItemStatus.Error
      steps[1].description = '密码重置失败'
      return false
    }
    // 重置成功
    steps[1].description = '密码重置成功'
    return true
  }
  // 重置失败
  steps[1].status = StepItemStatus.Error
  steps[1].description = '密码重置失败'
  return false
}

// 进行下一步
const doNext = async () => {
  // 帮助处理是否进入下一步操作
  function _helpHandleValidate(isValidate: boolean) {
    if (isValidate) {
      steps[activeStep.value].status = StepItemStatus.Finish
      activeStep.value = activeStep.value + 1
      steps[activeStep.value].status = StepItemStatus.Process
    } else {
      steps[activeStep.value].status = StepItemStatus.Error
    }
  }
  switch (activeStep.value) {
    case 0: {
      _helpHandleValidate(await validateFirst())
      break
    }
    case 1: {
      _helpHandleValidate(await validateSecond())
      break
    }
  }
}

// 重新发送短信验证码
const onChangeCaptcha = async () => {
  const res = await sentForgetMessage(findFormValue.value.phone)
  if (res.code === 200) {
    //   响应成功
    sentCaptcha.value = '' + res.data?.code
    app?.$message(`${res.msg}，请注意查收`, {
      type: 'success'
    } as MessageOptions)
  } else {
    app?.$message(`短信发送失败 ${res.msg}`, {
      type: 'error'
    } as MessageOptions)
  }
  findFormValue.value.captcha = ''
}

// 密码重置或查找完成
const onFinish = () => {
  router.push({ name: 'loginOrRegistry', state: { type: 'login' } })
}
</script>

<template>
  <n-layout>
    <n-layout-header class="center">
      <n-space justify="center">
        <n-text class="size30 hvr-wobble-skew" type="primary">密码找回中心</n-text>
      </n-space>
    </n-layout-header>
    <n-layout-content class="forgetContentContainer">
      <n-space :size="100" class="center">
        <div class="NStepContainer">
          <n-steps :current="activeStep">
            <n-step
              v-for="item in steps"
              :title="item.title"
              :description="item.description"
              :key="item.title"
              :status="item.status"
            />
          </n-steps>
        </div>
        <n-space v-if="activeStep === 0" vertical align="center">
          <n-form
            :model="findFormValue"
            ref="formRef"
            label-width="70"
            label-position="right"
            class="formContainer"
            :rules="findFormRules"
          >
            <n-space class="originElSpace" vertical :size="30">
              <n-grid class="rowCenter">
                <n-form-item-gi :span="14" label="用户id" path="loginId">
                  <n-input
                    v-model:value="findFormValue.loginId"
                    placeholder="请填写用户id"
                    clearable
                    autocomplete="on"
                    autofocus
                  />
                </n-form-item-gi>
                <n-gi :span="9" :offset="1" class="selfCenter">
                  <n-text type="default" class="size12">如果忘记用户id此项可以不填</n-text>
                </n-gi>
              </n-grid>
              <n-grid>
                <n-form-item-gi :span="16" label="手机号" path="phone" required first>
                  <n-input
                    v-model:value="findFormValue.phone"
                    placeholder="请填写手机号"
                    autocomplete="on"
                    clearable
                  />
                </n-form-item-gi>
                <n-gi :span="7" :offset="1" class="forgetCaptcha">
                  <get-captcha-index
                    :duration-time="1000 * 120"
                    @change="onChangeCaptcha"
                    :storage="false"
                    :storage-item-name="SessionStorageItemName.ForgetPwdCaptchaValidateTime"
                  >
                    <template v-slot:finishContent="{ clickFunc }">
                      <n-button
                        :disabled="sentMsgBtnDisabled"
                        type="primary"
                        @click="clickFunc"
                        plain
                      >
                        获取短信验证码
                      </n-button>
                    </template>
                    <template #activeContent="{ countChange, countTime }">
                      <n-button disabled type="info" class="registryFormCaptchaBtn">
                        <n-text>请</n-text>
                        <count-down :on-change="countChange" :time="countTime" />
                        <n-text>&nbsp;秒后获取</n-text>
                      </n-button>
                    </template>
                  </get-captcha-index>
                </n-gi>
              </n-grid>
              <n-grid>
                <n-form-item-gi :span="8" path="captcha" label="验证码" required first>
                  <n-input v-model:value="findFormValue.captcha" placeholder="请输入短信验证码" />
                </n-form-item-gi>
              </n-grid>
            </n-space>
          </n-form>
          <n-button class="center" @click="doNext">下一步</n-button>
        </n-space>
        <n-space vertical align="center" v-else-if="activeStep === 1">
          <n-form
            :model="resetFormValue"
            ref="formRef"
            label-width="70"
            label-position="right"
            class="formContainer"
            :rules="resetFormRules"
          >
            <n-space vertical class="originElSpace" :size="30">
              <n-form-item label="旧密码">
                <n-input readonly :model-value="resetFormValue.oldPwd" />
              </n-form-item>
              <n-form-item label="新密码" path="newPwd" first>
                <n-input
                  type="password"
                  clearable
                  show-password-toggle
                  placeholder="请输入新密码"
                  v-model:value="resetFormValue.newPwd"
                />
              </n-form-item>
              <n-form-item label="确认密码" path="confirmPwd" first>
                <n-input
                  type="password"
                  clearable
                  show-password-toggle
                  placeholder="请再次输入新密码"
                  v-model:value="resetFormValue.confirmPwd"
                />
              </n-form-item>
            </n-space>
          </n-form>
          <n-button class="center" @click="doNext">下一步</n-button>
        </n-space>
        <n-result v-else :title="`恭喜您，${isReseted ? '密码重置成功' : '密码找回成功'}！！！`">
          <template #footer>
            <n-button type="success" @click="onFinish">返回登录</n-button>
          </template>
          <template #icon>
            <n-icon size="20rem" color="green">
              <HappyOutline />
            </n-icon>
          </template>
        </n-result>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<style lang="less" scoped>
.forgetContentContainer {
  margin-top: 50px;
}

.NStepContainer {
  width: 1100px;
  margin-left: 12vw;
}

.formContainer {
  width: 800px;
  flex-basis: 100%;
}

.center {
  justify-content: center !important;
}

.forgetCaptcha {
  margin: auto;
}
</style>
