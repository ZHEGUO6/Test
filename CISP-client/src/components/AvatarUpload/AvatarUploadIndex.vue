<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { RequestUrl } from '@/types/enum'

const props = defineProps<{
  src?: string
  uploadOptions?: UploadProps
  onSuccess?: (response: API.ServerResponse) => void
}>()

const app = getCurrentInstance()?.appContext.config.globalProperties

// 当超出限制时，执行的钩子函数
const uploadExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  console.log('超出限制', files, uploadFiles)
}

const uploadError = (error: Error) => {
  let message = ''
  try {
    message = JSON.parse(error.message).msg
    if (message && typeof message === 'object') {
      if (message.path) {
        message = '请规范文件名，不要用特殊符号'
      }
    }
  } catch {
    message = '头像上传失败'
  } finally {
    app.$message({
      type: 'error',
      message: `${message}，请重新上传或者选择系统自定义的头像`,
      duration: 3000
    })
  }
}

// 图片上传成功
const uploadSuccess = (response: API.ServerResponse) => {
  props.onSuccess && props.onSuccess(response)
}

// 文件上传之前调用
const beforeUpload = (rawFile: UploadRawFile) => {
  const splitTypes = rawFile.type.split('/')
  return !splitTypes.filter((i) => i !== 'image' && !/(jpg|png|webp|bmp|gif|svg)/.test(i)).length
}
</script>

<template>
  <el-upload
    v-bind="props.uploadOptions"
    :action="RequestUrl.Image_UploadOne"
    list-type="picture"
    :on-exceed="uploadExceed"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :show-file-list="false"
    :before-upload="beforeUpload"
    accept=".jpg,.png,.webp,.bmp,.gif,.svg"
  >
    <slot name="default">
      <el-avatar :src="props.src"></el-avatar>
    </slot>
  </el-upload>
</template>

<style lang="less" scoped></style>
