<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {onBeforeMount, reactive, ref,getCurrentInstance} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';
import {getCaptcha,validateCaptcha} from "@/api/captcha";
import {validate} from "@/api/user";
import CountDown from '@/components/CounDown.vue'
import {ValidateLoginEnum} from "@/types/enum";
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
const formRef=ref<FormInstance>();
const rules = reactive<FormRules<typeof form>>({
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
      message:'恭喜您，登录成功'
  } as MessageOptions))
    await router.push('/');
  }
  else{
    app?.$message(({
      type:'error',
      message:'登录失败',
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
  localStorage.setItem('loginCaptchaValidateTime',`${val}`);
  countDownTime.value=Math.floor((val-Date.now())/1000);
}

// 获取验证码
const getCaptchaAsync=async()=>{
  const val=await getCaptcha();
  captcha.value=val as unknown as HTMLElement;
  localStorage.setItem('loginCaptcha',val as unknown as string);
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

onBeforeMount(async()=>{
  const captchaData=localStorage.getItem('loginCaptcha');
  captchaData?(captcha.value=captchaData as unknown as HTMLElement):await getCaptchaAsync();
  if(localStorage.getItem('loginCaptchaValidateTime')){
    let val=(+(localStorage.getItem('loginCaptchaValidateTime') as string))-Date.now();
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
  <div class="loginPageContainer">
    <div class="title">
      <el-text>Welcome to</el-text>
      <el-text>Campus sharing platform</el-text>
      <el-text>欢迎来到</el-text>
      <el-text>校园共享平台</el-text>
    </div>
    <div class="loginFormContainer">
      <el-form
          :model="form"
          label-position="right"
          status-icon
          :rules="rules"
          ref="formRef"
          class="loginForm"
      >
        <el-form-item
            label="昵称"
            :required="true"
            prop="nickname"
            :key="ValidateLoginEnum.NickName"
        >
          <el-input
              v-model="form.nickname"
          />
        </el-form-item>
        <el-form-item
            label="密码"
            :required="true"
            prop="loginPwd"
            :key="ValidateLoginEnum.LoginPwd"
        >
          <el-input
              type="password"
              v-model="form.loginPwd"
              :show-password="true"
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
            :key="ValidateLoginEnum.SaveTime"
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
        <el-form-item>
          <el-button class="btnCenter" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
      <el-link class="toRegistry" href="/registry">
        <el-text class="txt">注册</el-text>
      </el-link>
    </div>
  </div>
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

// 伪类样式
.pseudo-classes{
  top: -84%;
  left: -50%;
  z-index: 1;
  content: '';
  width: 100%;
  height: 130%;
  position: absolute;
}

.loginPageContainer{
  height: 100vh;
  display: flex;
  .backgroundMove();
  align-items: center;
  background-size: 120% 120%;
  justify-content: space-around;
  background-image: url("../.././public/images/background.png");
  & .title{
    &>*{
      display: block;
      font-size: 2.5em;
      font-weight: bold;
      color:transparent;
      .backgroundMove();
      text-align: center;
      background-clip: text;
      animation-duration: 15s;
      background-size: 300% 300%;
      animation-direction: normal;
      -webkit-background-clip: text;
      background-image: url("../../public/images/loginPageTitleBackground.png");
    }
  }
  & .loginFormContainer{
    width: 40%;
    height: 320px;
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    & .loginForm{
      inset: 2px;
      z-index: 2;
      width: 98.3%;
      height: 97%;
      top: 5px;
      left: 5px;
      --el-fill-color-blank: #C2BA7964;
      --el-text-color-placeholder: #000;
      --el-text-color-secondary: #2AC962F0;
      --el-border-color: #3d6ddc;
      --el-border-color-hover: #0a0dbe;
      --el-color-primary-light-9: #ABA69582;
      padding: 30px 50px 20px 20px;
      overflow: hidden;
      border-radius: 8px;
      position: absolute;
      background: #5bcdca;
    }
    &::before{
      .pseudo-classes();
      animation-delay: -3s;
      animation-duration: 6s;
      transform-origin: bottom right;
      animation-name:formBackground ;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      background: linear-gradient(0deg,transparent, #4D4DFF, #4D4DFF);
    }
    &::after{
      .pseudo-classes();
      animation-delay: -12s;
      animation-duration: 6s;
      transform-origin: bottom right;
      animation-name:formBackground ;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      background: linear-gradient(0deg,transparent, rgba(196, 36, 151, 0.93), rgba(196, 36, 151, 0.93));
    }
  }
  & .toRegistry{
    top: 5px;
    right: 4px;
    z-index: 5;
    width: 65px;
    height: 100px;
    position: absolute;
    clip-path: path('M 0 0 h 65 v 100 L 0 0 z');
    border-top-right-radius: 8px;
    background-image: linear-gradient(135deg,tomato,tan);
    &:hover{
      background-image: linear-gradient(135deg, #5794f3, #23cfde);
      & .txt{
        color:#f40;
      }
    }
    & .txt{
      top: 20%;
      right: 7%;
      display: block;
      position: absolute;
      color: #72df6b;
    }
  }
  & .alignCenter{
    align-items: center;
  }
  & .btnCenter{
    flex-basis:400px;
    margin-left: calc(50% - 200px);
  }
}


</style>
