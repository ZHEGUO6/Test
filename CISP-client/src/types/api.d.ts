declare namespace API {
  declare namespace User {

    // 验证昵称密码
    interface ValidateLogin {
      nickname: string
      loginPwd: string
    }

    // 登录信息
    interface Login {
      nickname: string
      loginPwd: string
      saveTime?: number
    }

    // 添加用户
    interface Add {
      /**
       * 地址
       */
      addr: string;
      /**
       * 头像
       */
      avatar: string;
      /**
       * 生日
       */
      birthDay: number;
      /**
       * 禁用状态
       */
      enabled: number;
      /**
       * 自我介绍
       */
      intro?: string;
      /**
       * 上次登录时间
       */
      lastLoginDate: number;
      /**
       * 帐号id
       */
      loginId: string;
      /**
       * 密码
       */
      loginPwd: string;
      /**
       * 邮箱
       */
      mail?: string;
      /**
       * 昵称
       */
      nickname: string;
      /**
       * 在线状态
       */
      online: string;
      /**
       * 手机号
       */
      phone?: string;
      /**
       * qq号
       */
      qq?: string;
      /**
       * 用户类型
       */
      type: string;
      /**
       * 微信号
       */
      wechat?: string;
    }

    // 修改用户信息
    interface Modify {
      /**
       * 地址
       */
      addr?: string;
      /**
       * 头像
       */
      avatar?: string;
      /**
       * 生日
       */
      birthDay?: number;
      /**
       * 禁用状态
       */
      enabled?: number;
      /**
       * 自我介绍
       */
      intro?: string;
      /**
       * 上次登录时间
       */
      lastLoginDate?: number;
      /**
       * 密码
       */
      loginPwd?: string;
      /**
       * 邮箱
       */
      mail?: string;
      /**
       * 昵称
       */
      nickname?: string;
      /**
       * 在线状态
       */
      online?: string;
      /**
       * 手机号
       */
      phone?: string;
      /**
       * QQ号
       */
      qq?: string;
      /**
       * 用户类型
       */
      type?: string;
      /**
       * 微信号
       */
      wechat?: string;
    }
  }

  declare namespace Captcha{

    // 检查验证码
    interface Validate {
      /**
       * 验证码
       */
      captcha: string;
    }
  }

  declare interface ServerResponse{
    code:number,
    msg:string,
    data:{
      datas:[]|{},
      count?:number
    }|null
  }
}
