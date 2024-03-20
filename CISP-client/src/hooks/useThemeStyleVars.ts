import { useThemeVars } from 'naive-ui'

export default (list: Array<string> | undefined) => {
  const themeVars = useThemeVars()
  console.log(themeVars)
  if (!list) {
    return themeVars.value
  }
  return list.reduce(
    (pre, cur) => ({
      ...pre,
      [`--${cur}`]: themeVars.value[cur]
    }),
    {}
  )
}
