export const formValidators = {
  qq: /^(\d{5,11}|'')$/,
  wechat: /^([a-zA-Z][\w-]{5,19}|'')$/,
  password: /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~!@#$%^&*.-])[a-zA-Z\d!#@*&.-]{8,32}/,
  addr: /^([0-9]+-){1,2}[0-9]+$/,
  phone: /^(1[3-9][0-9]{9}|'')$/,
  url: /(http|https):\/\/\w+((:\d{2,})|(.\w+)+)(\/[\w_]+)*(\/[\w_.]+\.(jpg|png|webp|bmp|gif|svg))/,
  mail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
}
