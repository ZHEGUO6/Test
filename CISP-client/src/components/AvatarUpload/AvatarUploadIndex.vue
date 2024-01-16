<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import { RequestUrl } from '@/types/enum'
import { NUpload, NAvatar } from 'naive-ui'
import { UploadProps, UploadFileInfo } from 'naive-ui/es'

const props = defineProps<{
  src?: string
  uploadOptions?: UploadProps
  onSuccess?: (response: API.ServerResponse) => void
}>()

const app = getCurrentInstance()?.appContext.config.globalProperties

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
const uploadSuccess = ({ event }: { event: ProgressEvent }) => {
  props.onSuccess && props.onSuccess(JSON.parse(event.currentTarget.response))
  // warn.js:10 [naive/upload]: File has no corresponding id in current file list. 解决这个警告
  setTimeout(() => {
    uploadRef.value.clear() // 清空上传列表
  })
}

const uploadRef = ref<any>(null)

// 文件上传之前调用
const beforeUpload = ({ file }: { file: UploadFileInfo }) => {
  console.log(file)
  if (file) {
    const splitTypes = file.type.split('/')
    return !splitTypes.filter((i) => i !== 'image' && !/(jpg|png|webp|bmp|gif|svg)/.test(i)).length
  }
}
</script>

<template>
  <n-upload
    ref="uploadRef"
    v-bind="props.uploadOptions"
    :show-file-list="false"
    :max="1"
    :action="RequestUrl.Image_UploadOne"
    list-type="image"
    accept=".jpg,.png,.webp,.bmp,.gif,.svg"
    @before-upload="beforeUpload"
    @finish="uploadSuccess"
    @error="uploadError"
  >
    <slot name="default">
      <n-avatar :src="props.src"></n-avatar>
    </slot>
  </n-upload>
</template>

<style lang="less" scoped></style>
