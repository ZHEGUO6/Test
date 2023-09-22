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
