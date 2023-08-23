import request from './request'
import {requestType, requestUrl} from '@/types/enum'

export const validate = async (info: API.User.validateLogin) => {
  return await request(requestType.post, requestUrl.user_validate,info);
}

export const login = async (info: API.User.login) => {
  return await request(requestType.post, requestUrl.user_login,info);
}

export const whoamI = async () => {
  return await request(requestType.get, requestUrl.user_whoamI);
}

export const loginOut = async () => {
  return await request(requestType.post, requestUrl.user_logout);
}
