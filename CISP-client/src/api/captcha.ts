import request from './request'
import { RequestType, RequestUrl } from '@/types/enum'

// 获取验证码
export const getCaptcha = async () => {
  return await request(RequestType.GET, RequestUrl.Captcha_Get)
}

// 验证验证码
export const validateCaptcha: (info: API.Captcha.Validate) => Promise<API.ServerResponse> = async (
  info
) => {
  return await request(RequestType.POST, RequestUrl.Captcha_Validate, info)
}
