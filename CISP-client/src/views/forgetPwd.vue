<script setup lang="ts">
import { ref, reactive, Component } from 'vue'
import { FormInstance } from 'element-plus'

// 当前步骤的状态
const enum StepItemStatus {
  Empty = '',
  Wait = 'wait',
  Process = 'process',
  Finish = 'finish',
  Error = 'error',
  Success = 'success'
}

const sentCaptcha = ref('') // 发送的短信验证码

const formRef = ref<FormInstance>()

// 查找表单项
const findFormValue = ref({
  loginId: '',
  phone: '',
  captcha: ''
})

// 查找表单校验规则
const findFormRules = {
  loginId: [],
  phone: [],
  captcha: []
}

// 重置表单项
const resetFormValue = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})

// 重置表单校验规则
const resetFormRules = {
  newPwd: [],
  confirmPwd: []
}

// 表单项
const formValue = ref(findFormValue)

const rules = ref({
  loginId: []
})

// 步骤条单项数据格式
declare interface StepItem {
  title: string
  description: string
  icon?: string | Component
  status: StepItemStatus
}

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

// 进行下一步
const doNext = () => {
  activeStep.value++
}

// 密码重置完成
const onFinish = () => {}
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
          <transition>
            <el-row v-if="activeStep === 0">
              <el-form ref="formRef" label-width="70" label-position="left" class="formContainer">
                <el-row class="rowCenter">
                  <el-col :span="15">
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
                  <el-col :span="1"></el-col>
                  <el-col :span="8">
                    <el-text type="info" class="size12">如果忘记用户id此项可以不填</el-text>
                  </el-col>
                </el-row>
                <el-form-item></el-form-item>
                <el-row>
                  <el-col>
                    <el-form-item label="手机号" prop="phone" required>
                      <el-input
                        v-model="findFormValue.phone"
                        placeholder="请填写手机号"
                        autocomplete="on"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item prop="captcha">
                      <el-input v-model="findFormValue.captcha" />
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-button>获取验证码</el-button>
                  </el-col>
                </el-row>
                <el-form-item></el-form-item>
              </el-form>
              <el-col class="center">
                <el-button @click="doNext">下一步</el-button>
              </el-col>
            </el-row>
            <el-row v-else-if="activeStep === 1">
              <el-form ref="formRef" label-width="80" label-position="left" class="formContainer">
                <el-form-item label="旧密码">
                  <el-input readonly model-value="" />
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input />
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input />
                </el-form-item>
              </el-form>
              <el-button @click="doNext">下一步</el-button>
            </el-row>
            <el-row v-else>
              <el-button @click="onFinish">返回首页</el-button>
            </el-row>
          </transition>
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
}
</style>
