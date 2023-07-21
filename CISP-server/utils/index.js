const obj = {
    // 根据生日获取年龄
    getAgeByBirthDay(birthDay) {
        const curDate = new Date();
        const birthDate = new Date(birthDay);
        const curYear = curDate.getFullYear();//当前年份
        const birthYear = curDate.getFullYear();//出生年份
        const disYear = curYear - birthYear;
        const curMonth = curDate.getMonth();
        const birthMonth = birthDate.getMonth();
        if (curMonth === birthMonth) {
            // 月份相等，判断日期大小
            const disDay = curDate.getDate() - birthDate.getDate();
            return disDay <= 0 ? disYear : disYear - 1;
        }
        const disMonth = curMonth - birthMonth;
        return disMonth > 0 ? disYear - 1 : disYear;
    },
    // 获取已结交的时间 xxxx年-xx月
    getMakeTime(makeTime) {
        const disYear = obj.getAgeByBirthDay(makeTime);
        const disMonth = new Date().getMonth() - new Date(makeTime).getMonth();
        return `${disYear}-${Math.abs(disMonth)}`
    },
    validators: {
        qq() {
            return /^\d{5,11}$/
        },
        wechat() {
            return /^[a-zA-Z][\w\-]{5,19}$/
        },
        /**
        * 密码正则 数字字母下划线特殊字符 !#@*&.-
        * @param {*} min 最小长度
        * @param {*} max 最大长度
        */
        password(min, max) {
            return new RegExp(`^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~!@#$%^&*\.\-])[a-zA-Z\d!#@*&\.\-]{${min},${max}}$`, 'g')
        },
        addr() {
            return /^([0-9]+\-){1,2}[0-9]+$/
        },
        phone() {
            return /^1[3-9][0-9]{9}$/
        }
    }
}
module.exports = obj