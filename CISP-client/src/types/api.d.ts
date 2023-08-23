declare namespace API {
  declare namespace User {
    interface validateLogin {
      nickname: string
      loginPwd: string
    }
    interface login {
      nickname: string
      loginPwd: string
      saveTime?: number
    }
  }
}
