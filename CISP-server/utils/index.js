const { DataTypes, ValidationError } = require("sequelize");
const obj = {
  // 根据生日获取年龄
  getAgeByBirthDay(birthDay) {
    const curDate = new Date();
    const birthDate = new Date(birthDay);
    const curYear = curDate.getFullYear(); //当前年份
    const birthYear = curDate.getFullYear(); //出生年份
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
  // 判断是不是闰年
  isLoopYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },
  // 获取已结交的时间 xxxx年-xx月
  getMakeTime(makeTime) {
    const disYear = obj.getAgeByBirthDay(makeTime);
    const curDate = new Date(); // 当前的时间
    // 四年一润
    const disYearDate = new Date(
      makeTime +
        disYear *
          (obj.isLoopYear(curDate.getFullYear() + disYear) ? 366 : 365) *
          24 *
          60 *
          60 *
          1000
    ); // 除去已结交年数的时间
    const disMonth = curDate.getMonth() - disYearDate.getMonth();
    const finalMonth = Math.abs(disMonth);
    if (finalMonth === 0) {
      // 结交时间还没超一个月
      return `${disYear}-${finalMonth}-${
        curDate.getDate() - disYearDate.getDate() + 1
      }`;
    }
    return `${disYear}-${finalMonth}-${
      disYearDate.getDate() - curDate.getDate() + 1
    }`;
  },
  validators: {
    qq() {
      return /^\d{5,11}$/g;
    },
    wechat() {
      return /^[a-zA-Z][\w\-]{5,19}$/g;
    },
    /**
     * 密码正则 数字字母下划线特殊字符 !#@*&.-
     * @param {*} min 最小长度
     * @param {*} max 最大长度
     */
    password(min, max) {
      return new RegExp(
        `^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~!@#$%^&*\.\-])[a-zA-Z\d!#@*&\.\-]{${min},${max}}$`
      );
    },
    addr() {
      return /^(([0-9\/.]+-){1,3}[0-9\/.]+)|[0-9\/.]+$/g;
    },
    phone() {
      return /^1[3-9][0-9]{9}$/g;
    },
    url() {
      return /(http|https):\/\/\w+((:\d{2,})|(.\w+)+)(\/[\w_]+)*(\/[\w_.]+\.(jpg|png|webp|bmp|gif|svg))/g;
    },
    /*
     * 自定义正则验证
     * reg : 验证规则
     * type : 属性类型
     * name : 验证的属性名
     * */
    validateTest: (reg, type, name) => {
      return (value) => {
        if (typeof value === type && !value) {
          return;
        }
        const res = new RegExp(reg).test(value);
        if (!res) {
          throw new ValidationError(`Validation on ${name} failed`);
        }
      };
    },
  },
  permissionOpt: () => ({
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 1,
    },
  }),
  boolOpt: (bool) => ({
    type: DataTypes.BOOLEAN,
    defaultValue: bool ?? true,
    validate: {
      isIn: [[false, true]],
    },
  }),
};
module.exports = obj;
