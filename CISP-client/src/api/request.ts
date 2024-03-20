import axios from 'axios'
import { RequestType, RequestUrl } from '@/types/enum'

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
  url: RequestUrl | string,
  options?: object
) => API.ServerResponse = async (method, url, options) => {
  return await request[method](url, options).catch((err) => {
    if (window.$rawMessage) {
      if (err.response) {
        window.$message(`操作失败 ${err.response.data?.msg ?? err.response.data?.info ?? ''}`, {
          type: 'error'
        })
        return err.response.data
      }
      window.$message(`操作失败 ${err.message ?? ''}`, { type: 'error' })
    }
    return { code: err.code, msg: err.message, data: null }
  })
}

export default requestWrapper
