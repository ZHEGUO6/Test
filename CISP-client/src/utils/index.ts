export const deepClone: (val: any) => any = (clone) => {
  if (typeof clone === 'object') {
    if (Array.isArray(clone)) {
      return clone.map(deepClone)
    } else {
      //     认为是object对象
      for (const cloneKey in clone) {
        clone[cloneKey] = deepClone(clone[cloneKey])
      }
      return clone
    }
  } else {
    return clone
  }
}

// 保留需要的数据，同时确保不会出现空值
export const filterObj = (val: any, saveList: Array<string>) => {
  if (typeof val !== 'object') {
    return
  }
  if (Array.isArray(val)) {
    const res = []
    for (const valElement of val) {
      if (typeof valElement === 'object') {
        res.push(filterObj(valElement, saveList))
      } else {
        valElement ?? (valElement && res.push(valElement))
      }
    }
    return res
  } else {
    const res = {}
    for (const valKey in val) {
      if (saveList.includes(valKey)) {
        //   需要进行保留
        const item = val[valKey]
        typeof item === 'object'
          ? (res[valKey] = filterObj(item, saveList))
          : item && (res[valKey] = item)
      }
    }
    return res
  }
}

// 保留需要的数据，同时确保不会出现空值
export const filterObj = (val: any, saveList: Array<string>) => {
  if (typeof val !== 'object') {
    return
  }
  if (Array.isArray(val)) {
    const res = []
    for (const valElement of val) {
      if (typeof valElement === 'object') {
        res.push(filterObj(valElement, saveList))
      } else {
        valElement ?? (valElement && res.push(valElement))
      }
    }
    return res
  } else {
    const res = {}
    for (const valKey in val) {
      if (saveList.includes(valKey)) {
        //   需要进行保留
        const item = val[valKey]
        typeof item === 'object'
          ? (res[valKey] = filterObj(item, saveList))
          : item && (res[valKey] = item)
      }
    }
    return res
  }
}
