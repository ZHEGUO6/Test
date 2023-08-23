import axios from 'axios'
import { requestType, requestUrl } from '@/types/enum'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
  timeoutErrorMessage: '请求超时，请稍后再试'
})

// // 请求拦截
// request.interceptors.request.use((options) => {
//   return options
// });

// 响应拦截
request.interceptors.response.use((options) => options.data)

export default async (method: requestType, url: requestUrl, options?: object) => {
  return await request[method](url, options).catch((err) => {
    if (err.response) {
      return err.response.data
    }
    return { code: err.code, msg: err.message, data: null }
  })
}
