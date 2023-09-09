<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {onBeforeMount, reactive, ref,getCurrentInstance} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';
import {getCaptcha,validateCaptcha} from "@/api/captcha";
import {validate} from "@/api/user";
import CountDown from '@/components/CounDown.vue'
import {ValidateRegistryEnum} from "@/types/enum";
import {FormInstance, FormRules} from "element-plus";
import {MessageOptions} from 'element-plus/lib/components'

/**
 * data定义
 */
const form = reactive<API.User.Login&{captcha:string}>({ nickname: '', loginPwd: '', captcha: '', saveTime: 0 });
const router = useRouter();
const {login}=useUserStore();
const { isLogin } = storeToRefs(useUserStore());
const app=getCurrentInstance()?.appContext.config.globalProperties;
const countDownTime=ref<number>(0);
const captcha=ref<HTMLElement>();
const selectOptions=[
  {
    label:'七天免登录',
    value:1000*3600*24*7
  },
  {
    label:'十五天免登录',
    value:1000*3600*24*15
  },
  {
    label:'三十天免登录',
    value:1000*3600*24*30
  },
];// 选择免登录时间
const useAutoLogin=ref<boolean>(false);// 是否启用免登录
const useMoreSettings=ref<boolean>(false);// 是否设置更多注册信息

const formRef=ref<FormInstance>(); 
const rules = ref<FormRules<typeof form>>({
  nickname: [
    {required:true,message:'请填写昵称'},
    {min:2,max:10,message:'昵称的长度为2-10位',trigger:['blur']},
  ],
  loginPwd: [
    {required:true,message:'请填写密码'},
    {min:8,message:'密码不能小于8位',trigger:['blur']},
    {max:32,message:'密码不能超过32位',trigger:['blur']},
  ],
  captcha: [
    {required:true,message:'请填写验证码'},
    {len:6,message:'请正确输入验证码'},
    {validator:(_,value,callback)=>{
        validateCaptcha({captcha:value}).then(res=>{
          if(res.code!==200){
            callback(res.msg);
          }
          callback();
        },err=>{
          callback(err.message)
        })
      }}
  ],
})

/**
 * 方法定义
 */
const onSubmit = async () => {
  // 进行整体表单校验
  formRef.value?.validate();
  // 进行密码验证
  const res=await validate({nickname:form.nickname,loginPwd:form.loginPwd}).catch(err=>{
    app?.$message(({
      type:'error',
      message:`服务器响应出错，${err.message}`,
      duration:3000
    }as MessageOptions))
    return {code:500}
  })
  if(res.code!==200&&res.code!==500){
    app?.$message(({
      type:'error',
      message:`您填写的昵称或密码不正确，请核对后操作，点击关闭按钮不会清空您已填写的内容`,
      duration:3000,
      onClose:(type?:string)=>{
        if(!type){
          formRef.value?.resetFields(['nickname','loginPwd']);// 清空昵称和密码
        }
        formRef.value?.resetFields(['captcha']);
        getCaptchaAsync();
      }
    }as MessageOptions))
  }
  await login(form);
  if (isLogin.value) {
    app?.$message(({
      type:'success',
      message:'恭喜您，注册成功'
    } as MessageOptions))
    await router.push('/');
  }
  else{
    app?.$message(({
      type:'error',
      message:'注册失败',
      duration:3000
    } as MessageOptions))
  }
};

// 计时器组件时间改变回调
const onCountDownChange=(time:number)=>{
  countDownTime.value=time;
};

// 重置验证码验证剩余时间
const resetCountDownTime=()=>{
  const val=Date.now()+1000*120;
  localStorage.setItem('registryCaptchaValidateTime',`${val}`);
  countDownTime.value=Math.floor((val-Date.now())/1000);
}

// 获取验证码
const getCaptchaAsync=async()=>{
  const val=await getCaptcha();
  captcha.value=val as unknown as HTMLElement;
  localStorage.setItem('registryCaptcha',val as unknown as string);
}

// 按钮更换验证码
const btnGetCaptcha=async()=>{
  resetCountDownTime();
  await getCaptchaAsync();
}

// 开启免登录
const onOpenSaveTime=()=>{
  useAutoLogin.value=true;
  form.saveTime=selectOptions[0].value;
}

// 开启设置更多注册信息
const onOpenMoreSettings=()=>{
  useMoreSettings.value=true;
  rules.value={
    ...rules.value,

  }
}

onBeforeMount(async()=>{
  const captchaData=localStorage.getItem('registryCaptcha');
  captchaData?(captcha.value=captchaData as unknown as HTMLElement):await getCaptchaAsync();
  if(localStorage.getItem('registryCaptchaValidateTime')){
    let val=(+(localStorage.getItem('registryCaptchaValidateTime') as string))-Date.now();
    if(val<0){
      val=0
    }
    else{
      val=Math.floor(val/1000);
    }
    countDownTime.value=val;
  }
  else{
    // 第一次加载
    resetCountDownTime();
  }
})
</script>

<template>
  <el-scrollbar
  >
    <el-form
        :model="form"
        label-position="right"
        status-icon
        :rules="rules"
        ref="formRef"
        class="registryForm"
    >
      <el-form-item
          label="角色"
          :required="true"
          :prop="ValidateRegistryEnum.Type"
          :key="ValidateRegistryEnum.Type"
      >
        <el-input
            v-model="form.nickname"
            placeholder="请选择您的角色"
        />
      </el-form-item>
      <el-form-item
          label="昵称"
          :required="true"
          :prop="ValidateRegistryEnum.NickName"
          :key="ValidateRegistryEnum.NickName"
      >
        <el-input
            v-model="form.nickname"
            placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item
          label="密码"
          :required="true"
          :prop="ValidateRegistryEnum.LoginPwd"
          :key="ValidateRegistryEnum.LoginPwd"
      >
        <el-input
            type="password"
            v-model="form.loginPwd"
            placeholder="请输入密码"
            :show-password="true"
        />
      </el-form-item>
      <el-form-item
          label="确认密码"
          :required="true"
          :prop="ValidateRegistryEnum.ConfirmPwd"
          :key="ValidateRegistryEnum.ConfirmPwd"
      >
        <el-input
            type="password"
            v-model="form.loginPwd"
            placeholder="请再次输入相同的密码"
            :show-password="true"
        />
      </el-form-item>
      <el-form-item
          label="验证码"
          :required="true"
          :prop="ValidateRegistryEnum.Captcha"
          :key="ValidateRegistryEnum.Captcha"
          class="alignCenter"
      >
        <el-col :span="6">
          <el-input
              v-model="form.captcha"
          />
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="6">
          <div v-html="captcha" />
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="9">
          <div>
            <el-button type="info" v-if="countDownTime" :disabled="true">
              <count-down  :time="countDownTime" :on-change="onCountDownChange" />
              <el-text>&nbsp;秒后重新获取验证码</el-text>
            </el-button>
            <el-button type="primary" @click="btnGetCaptcha" v-else>
              <el-text>请重新获取验证码</el-text>
            </el-button>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item
          :label="useAutoLogin?'请选择免登录时间':'是否开启免登录'"
          key="settingMore"
      >
        <el-switch @click="onOpenMoreSettings">设置更多注册信息</el-switch>
      </el-form-item>
      <template v-if="useMoreSettings">
        <el-form-item>

        </el-form-item>
      </template>
      <el-form-item
          :label="useAutoLogin?'请选择免登录时间':'是否开启免登录'"
          :key="ValidateRegistryEnum.SaveTime"
      >
        <el-col :span="8">
          <el-select
              v-if="useAutoLogin"
              v-model="form.saveTime"
              placeholder="请选择免登录时间"
          >
            <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-switch v-else @click="onOpenSaveTime">开启免登录</el-switch>
        </el-col>
      </el-form-item>
      <el-form-item
          label="确认密码"
          :required="true"
          :prop="ValidateRegistryEnum.ConfirmPwd"
          :key="ValidateRegistryEnum.ConfirmPwd"
      >
        <el-input
            type="password"
            v-model="form.loginPwd"
            :show-password="true"
        />
      </el-form-item>
      <el-form-item
          label="确认密码"
          :required="true"
          :prop="ValidateRegistryEnum.ConfirmPwd"
          :key="ValidateRegistryEnum.ConfirmPwd"
      >
        <el-input
            type="password"
            v-model="form.loginPwd"
            :show-password="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="btnCenter" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
</template>
<style scoped lang="less">
// 背景图片移动动画
@keyframes backgroundMove {
  0%{
    background-position: 1% 1%;
  }
  100%{
    background-position: 100% 100%;
  }
}

//表单背景旋转
@keyframes formBackground {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

//背景图片移动设置
.backgroundMove{
  animation-duration: 6s;
  background-repeat: no-repeat;
  animation-name: backgroundMove;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-timing-function: linear(-0 -2.94%, 1 100%);
}
& .registryForm{
  width: 100%;
  height: 100%;
  --el-fill-color-blank: #C2BA7964;
  --el-text-color-placeholder: #000;
  --el-text-color-secondary: #2AC962F0;
  --el-border-color: #3d6ddc;
  --el-border-color-hover: #0a0dbe;
  --el-color-primary-light-9: #ABA69582;
  padding: 30px 50px 20px 20px;
  overflow: hidden;
  border-radius: 8px;
  background: #5bcdca;
}

& .alignCenter{
  align-items: center;
}
& .btnCenter{
  flex-basis:400px;
  margin-left: calc(50% - 200px);
}

</style>
