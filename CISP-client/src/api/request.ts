import axios from 'axios'
import { RequestType, RequestUrl } from '@/types/enum'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  timeoutErrorMessage: '请求超时，请稍后再试'
})

// // 请求拦截
// request.interceptors.request.use((options) => {
//   return options
// });

// 响应拦截
request.interceptors.response.use((options) => options.data)

const requestWrapper: (
  method: RequestType,
  url: RequestUrl,
  options?: object
) => Promise<API.ServerResponse> = async (method, url, options) => {
  return await request[method](url, options).then(
    (res) => {
      ElMessage.success({
        message: `操作成功 ${res.msg}`,
        duration: 2000,
        showClose: true
      })
      return res
    },
    (err) => {
      if (err.response) {
        ElMessage.error({
          message: `操作失败 ${
            (err.response.data?.message &&
              (typeof err.response.data.message === 'object'
                ? JSON.stringify(err.response.data.message)
                : err.response.data.message)) ||
            typeof err.response.data === 'object'
              ? JSON.stringify(err.response.data)
              : err.response.data
          }`,
          duration: 4000,
          showClose: true
        })
        return err.response.data
      }
      ElMessage.error({
        message: `操作失败 ${err.message}`,
        duration: 4000,
        showClose: true
      })
      return { code: err.code, msg: err.message, data: null }
    }
  )
}

export default requestWrapper
