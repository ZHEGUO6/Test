module.exports = {
    /**
     * 剔除不需要的键
     * @param {*} obj 需要处理的对象
     * @param {*} meetKeys 满足需求的键
     * @returns {}
     */
    getMeetItemFromObj(obj, meetKeys) {
        if (typeof obj !== 'object' || typeof obj === 'function' || Array.isArray(obj)) {
            return
        }
        for (const key in obj) {
            if (!meetKeys.includes(key)) {
                delete obj[key];
            }
        }
        return obj;
    },
}