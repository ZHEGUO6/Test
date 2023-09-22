import axios from 'axios'
import { RequestType, RequestUrl } from '@/types/enum'

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

const requestWrapper: (
  method: RequestType,
  url: RequestUrl,
  options?: object
) => Promise<API.ServerResponse> = async (method, url, options) => {
  return await request[method](url, options).then(
    (res) => res,
    (err) => {
      if (err.response) {
        return err.response.data
      }
      return { code: err.code, msg: err.message, data: null }
    }
  )
}

export default requestWrapper
