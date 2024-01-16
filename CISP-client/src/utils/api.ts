import { getSingle } from '@/api/user'

// 查找指定用户
export const findSingleUser = async (info: API.User.Find) => {
  const res = await getSingle(info)
  return res.data
}
