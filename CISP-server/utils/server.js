// 与服务器响应相关的函数
const baseSend = (code = 200, msg = "", data = null) => {
  return {
    code,
    msg,
    data,
  };
};

const readImageReqData = (req) =>
  new Promise((resolve, reject) => {
    let str = "";
    req.on("data", (data) => {
      str += data.toString();
    });
    req.on("end", () => {
      resolve(str);
    });
  });
// 读取请求体
const readReqData = (req) =>
  new Promise(async (resolve, reject) => {
    const str = await readImageReqData(req);
    try {
      resolve(JSON.parse(str));
    } catch (error) {
      reject(error);
    }
  });

// 返回true代表无需再响应客户端消息了
const catchError = (next, error) => {
  return () => {
    next(error);
    return true;
  };
};

/**
 * 通用的响应需要验证的方法
 * @param {*} req 请求对象
 * @param {*} next 移交给下个中间件函数
 * @param {*} instance 模型实例
 * @param {*} validateFunc 参数验证方法
 * @param {*} action 针对模型的动作，如：create、update
 * @param {*} filterCallback 过滤的回调，可能会有二次过滤
 * @param {*} modelOption 调用模型方法传递的第二个参数
 * @returns
 */
const commonValidate = async (
  req,
  next,
  instance,
  validateFunc,
  action,
  modelOption = {},
  filterCallback = undefined
) => {
  async function _validate(item) {
    let yetOver = true;
    filterCallback && (yetOver = await filterCallback(item));
    return yetOver;
  }
  // 剔除不需要的键值对
  let params = await readReqData(req).catch((err) => catchError(next, err)());
  if (Array.isArray(params)) {
    let filter = [];
    // 剔除不需要的键值对
    for (let index = 0; index < params.length; index++) {
      const item = await validateFunc(params[index]);
      if (!item) {
        // 检测不通过
        return catchError(next, `传递的信息数量与预期的不一致`)();
      }
      filter.push(item);
      const result = await _validate(item);
      if (!result) {
        return false;
      }
    }
    params = filter;
  } else {
    params = await validateFunc(params);
    if (!params) {
      // 检测不通过
      return catchError(next, `传递的信息数量与预期的不一致`)();
    }
    const result = await _validate(params);
    if (!result) {
      return false;
    }
  }
  return await instance[action](params, modelOption).catch((err) => {
    return catchError(
      next,
      `传递的数据格式不对或者对象已存在导致数据库报错 ${err.name} ${err.message}`
    )();
  });
};

/**
 * 处理获取数据库出错问题，处理值为null或undefined情况
 * @param data 获取到的数据
 * @param successCB 数据响应成功的回调
 * @param errorCB 数据响应有误的回调
 */
const handleDataEmpty = (data, successCB, errorCB) => {
  if (data === null || data === undefined || data === false) {
    errorCB && errorCB();
    return;
  }
  if (typeof data !== "boolean") {
    successCB(data);
  }
};

module.exports = {
  baseSend,
  readReqData,
  readImageReqData,
  commonValidate,
  catchError,
  handleDataEmpty,
};
