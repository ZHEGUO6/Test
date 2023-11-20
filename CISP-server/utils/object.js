const { log } = require("debug");
module.exports = {
  /**
   * 剔除不需要的键
   * @param {*} obj 需要处理的对象
   * @param {*} mustMeetKeys 严格满足的键
   * @param {*} weekMeetKeys 弱满足的键
   * @returns object or boolean
   */
  async getMeetItemFromObj(obj, mustMeetKeys, weekMeetKeys = []) {
    if (typeof obj !== "object") {
      return false;
    }
    async function _validate(meetKey, must = false) {
      if (typeof meetKey === "string") {
        if (!objOfKeys.includes(meetKey)) {
          delete obj[meetKey];
          must && meetKeyCont--;
        }
      } else {
        // 需要对满足的数据进行过滤
        if (!objOfKeys.includes(meetKey[0])) {
          delete obj[meetKey[0]] && must && meetKeyCont--;
        } else {
          obj[meetKey[0]] = await meetKey[1](obj[meetKey[0]]);
        }
      }
    }
    const objOfKeys = Object.keys(obj);
    let meetKeyCont = objOfKeys.length;
    if (
      typeof obj !== "object" ||
      typeof obj === "function" ||
      Array.isArray(obj)
    ) {
      return;
    }
    mustMeetKeys.length &&
      (await Promise.all(mustMeetKeys.map((i) => _validate(i, true))));
    if (meetKeyCont < mustMeetKeys.length) {
      return false;
    }
    weekMeetKeys.length &&
      (await Promise.all(weekMeetKeys.map((i) => _validate(i))));
    return meetKeyCont >= mustMeetKeys.length ? obj : false;
  },
};
