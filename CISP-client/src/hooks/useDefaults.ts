export default (
  initialVal: { [k: string]: unknown },
  defaultValue: { [k: keyof typeof initialVal]: unknown }
) => {
  const res = {
    ...defaultValue,
    ...initialVal
  }
  for (const initialValKey in initialVal) {
    let it = initialVal[initialValKey]
    if (Object.prototype.toString.call(it).replace(']', '').split(' ')[1] === 'Object') {
      res[initialValKey] = {
        ...defaultValue[initialValKey],
        ...it
      }
    } else {
      res[initialValKey] = it ?? defaultValue[initialValKey]
    }
  }
  return res
}
