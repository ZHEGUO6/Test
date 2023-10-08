<script setup lang="ts">
import { ref, reactive, Component, getCurrentInstance, computed } from 'vue'
import { FormInstance, FormItemRule } from 'element-plus'
import GetCaptchaIndex from '@/components/GetCaptcha/GetCaptchaIndex.vue'
import { SessionStorageItemName } from '@/types/enum'
import { FormRules } from 'element-plus'
import { decrypt } from '@/utils/encryptOrDecrypt'
import { findAll, modify } from '@/api/user'
import { sentForgetMessage } from '@/api/three-party'
import { filterObj } from '@/utils'
import { SuccessFilled } from '@element-plus/icons-vue'
import type { MessageOptions } from 'element-plus/lib/components'
import { useRouter } from 'vue-router'
import { simpleValidatorFunc, formValidators } from '@/utils/validate'

// 步骤条单项数据格式
declare interface StepItem {
  title: string
  description: string
  icon?: string | Component
  status: StepItemStatus
}

// 当前步骤的状态
const enum StepItemStatus {
  Empty = '',
  Wait = 'wait',
  Process = 'process',
  Finish = 'finish',
  Error = 'error',
  Success = 'success'
}

const sentCaptcha = ref('1234') // 发送的短信验证码

const formRef = ref<FormInstance>()

// 查找的表单项
const findFormValue = ref({
  loginId: '',
  phone: '',
  captcha: ''
})

const sentMsgBtnDisabled = ref<boolean>(true) // 获取验证码按钮是否处于禁用状态

const app = getCurrentInstance()?.appContext.config.globalProperties
const router = useRouter()

// 查找的表单校验规则
const findFormRules: FormRules = {
  loginId: [{ len: 36, message: '用户id为36位', trigger: ['blur'] }],
  phone: [
    {
      required: true,
      message: '请填写手机号'
    },
    { len: 11, message: '手机号位数不正确', trigger: ['blur'] },
    {
      validator: simpleValidatorFunc(
        (value: string) =>
          value.length === 11
            ? formValidators.phone.test(value) && !(sentMsgBtnDisabled.value = false)
            : true,
        '手机号验证未通过'
      )
    }
  ],
  captcha: [
    {
      required: true,
      message: '验证码不能为空'
    },
    {
      validator: simpleValidatorFunc(
        (value: string) => value === sentCaptcha.value,
        '验证码有误，请重新检查或再次获取'
      ),
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
    { required: true, message: '请填写密码' },
    { min: 8, message: '密码不能小于8位', trigger: ['blur'] },
    { max: 32, message: '密码不能超过32位', trigger: ['blur'] },
    {
      validator: (
        rule: FormItemRule,
        value: string,
        callback: (error?: string | Error) => void
      ) => {
        let isValidate = true //判断是否验证通过
        if (!formValidators.password.test(value)) {
          callback('密码要求数字、字母加特殊字符')
          isValidate = false
        }
        if (resetFormValue.value.oldPwd !== value) {
          callback('新密码不能与原密码相同')
          isValidate = false
        }
        isValidate && callback()
      },
      trigger: ['blur']
    }
  ],
  confirmPwd: [
    { required: true, message: '请再次输入密码' },
    {
      validator: simpleValidatorFunc(
        (value: string) => value === resetFormValue.value.newPwd,
        '两次输入的密码不一致，请检查'
      ),
      trigger: ['blur']
    }
  ]
}

const isReseted = ref<boolean>(false) // 判断是否进行了重置密码操作

const activeStep = ref<number>(0)
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
  const validate = await formRef.value?.validate().catch((err) => err)
  if (typeof validate !== 'object') {
    //   表单验证成功
    const info: API.User.Find = {
      phone: findFormValue.value.phone
    }
    findFormValue.value.loginId && (info.loginId = findFormValue.value.loginId)
    const res = await findAll(info)
    if (res.data?.count) {
      resetFormValue.value.oldPwd = decrypt(res.data.datas[0].loginPwd)
      console.log(resetFormValue.value.oldPwd)
      steps[0].description = '旧密码已成功找到'
      return true
    } else {
      //   未找到对应的用户
      app?.$message({
        type: 'error',
        duration: 4000,
        message:
          '未找到对应用户，请确保该用户已注册，4秒后自动跳转到注册页，如果关闭弹窗将拒绝跳转',
        onClose: (type: string | undefined) => {
          if (type && type === 'click') {
            //   取消去注册页
            return
          }
          router.push({ name: 'loginOrRegistry', state: { type: 'registry' } })
        }
      } as MessageOptions)
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
  const validate = await formRef.value?.validate().catch((err) => err)
  if (typeof validate === 'object') {
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
      steps[activeStep.value].status = StepItemStatus.Success
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
    sentCaptcha.value = '' + res.data.code
    app.$message({
      type: 'success',
      message: `${res.msg}，请注意查收`
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
  <el-container>
    <el-header class="center">
      <el-row justify="center">
        <el-text class="size30 hvr-wobble-skew" type="primary">密码找回中心</el-text>
      </el-row>
    </el-header>
    <el-main>
      <el-row justify="center">
        <el-space direction="vertical" :size="100">
          <div class="elStepContainer">
            <el-steps align-center :active="activeStep">
              <el-step
                v-for="item in steps"
                :title="item.title"
                :description="item.description"
                :key="item.title"
                :status="item.status"
              />
            </el-steps>
          </div>
          <el-row v-if="activeStep === 0">
            <el-form
              :model="findFormValue"
              ref="formRef"
              label-width="70"
              label-position="right"
              class="formContainer"
              :rules="findFormRules"
            >
              <el-space class="originElSpace" direction="vertical" :size="30">
                <el-row class="rowCenter">
                  <el-col :span="16">
                    <el-form-item label="用户id" prop="loginId">
                      <el-input
                        v-model="findFormValue.loginId"
                        placeholder="请填写用户id"
                        clearable
                        autocomplete="on"
                        autofocus
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7" :offset="1">
                    <el-text type="info" class="size12">如果忘记用户id此项可以不填</el-text>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="手机号" prop="phone" required>
                      <el-input
                        v-model="findFormValue.phone"
                        placeholder="请填写手机号"
                        autocomplete="on"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7" :offset="1">
                    <get-captcha-index
                      :duration-time="1000 * 120"
                      :on-change="onChangeCaptcha"
                      :storage="false"
                      :storage-item-name="SessionStorageItemName.ForgetPwdCaptchaValidateTime"
                    >
                      <template v-slot:finishContent="{ clickFunc }">
                        <el-button
                          :disabled="sentMsgBtnDisabled"
                          type="primary"
                          @click="clickFunc"
                          plain
                        >
                          获取短信验证码
                        </el-button>
                      </template>
                      <template v-slot:activeText>
                        <el-text>&nbsp;秒后重新获取</el-text>
                      </template>
                    </get-captcha-index>
                  </el-col>
                </el-row>
                <el-col :span="8">
                  <el-form-item prop="captcha" label="验证码" required>
                    <el-input v-model="findFormValue.captcha" placeholder="请输入短信验证码" />
                  </el-form-item>
                </el-col>
              </el-space>
            </el-form>
            <el-col class="center">
              <el-button @click="doNext">下一步</el-button>
            </el-col>
          </el-row>
          <el-row v-else-if="activeStep === 1">
            <el-form
              :model="resetFormValue"
              ref="formRef"
              label-width="70"
              label-position="right"
              class="formContainer"
              :rules="resetFormRules"
            >
              <el-space direction="vertical" class="originElSpace" :size="30">
                <el-form-item label="旧密码">
                  <el-input readonly :model-value="resetFormValue.oldPwd" />
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                  <el-input
                    type="password"
                    clearable
                    show-password
                    v-model="resetFormValue.newPwd"
                  />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPwd">
                  <el-input
                    type="password"
                    clearable
                    show-password
                    v-model="resetFormValue.confirmPwd"
                  />
                </el-form-item>
              </el-space>
            </el-form>
            <el-col class="center">
              <el-button @click="doNext">下一步</el-button>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-space direction="vertical" :size="40">
              <el-col class="center">
                <el-icon color="green" size="12em">
                  <success-filled class="successIcon" />
                </el-icon>
              </el-col>
              <el-col>
                <el-text type="success" class="size30"
                  >恭喜您，{{ isReseted ? '密码重置成功' : '密码找回成功' }}！！！</el-text
                >
              </el-col>
              <el-col class="center">
                <el-button type="success" @click="onFinish">返回登录</el-button>
              </el-col>
            </el-space>
          </el-row>
        </el-space>
      </el-row>
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.elStepContainer {
  width: 1100px;
}

.formContainer {
  width: 600px;
  flex-basis: 100%;
}
</style>
