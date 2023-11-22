declare namespace API {
  // 分页获取
  interface SearchPage {
    /**
     * 查询几条数据
     */
    limit?: string
    /**
     * 查询第几页数据
     */
    page?: string
  }

  // 消息
  declare namespace Message {
    /**
     * 获取消息
     */
    interface Get {
      /**
       * 用户id
       */
      uId: string
      /**
       * 内容
       */
      content: string
      /**
       * 创建时间
       */
      createdAt: string
      /**
       * 删除时间
       */
      deletedAt: null | string
      /**
       * 消息id
       */
      messageId: number
      /**
       * 浏览数
       */
      scanNumber: number
      /**
       * 标题
       */
      title: string
      /**
       * 更新时间
       */
      updatedAt: string
    }

    /**
     * 新增消息
     */
    interface Add {
      /**
       * 管理员id
       */
      aId: string
      /**
       * 内容
       */
      content: string
      /**
       * 标题
       */
      title: string
    }

    /**
     * 修改消息
     */
    interface Modify {
      /**
       * 内容
       */
      content?: string
      /**
       * 标题
       */
      title?: string
    }
  }

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
      addr?: string
      /**
       * 头像
       */
      avatar: string
      /**
       * 生日
       */
      birthDay: number | Date
      /**
       * 禁用状态
       */
      enabled?: number
      /**
       * 自我介绍
       */
      intro?: string
      /**
       * 上次登录时间
       */
      lastLoginDate?: number
      /**
       * 帐号id
       */
      loginId: string
      /**
       * 密码
       */
      loginPwd: string
      /**
       * 邮箱
       */
      mail?: string
      /**
       * 昵称
       */
      nickname: string
      /**
       * 在线状态
       */
      online?: string
      /**
       * 手机号
       */
      phone?: string
      /**
       * qq号
       */
      qq?: string
      /**
       * 用户类型
       */
      type?: 'student' | 'teacher'
      /**
       * 微信号
       */
      wechat?: string
    }

    // 修改用户信息
    interface Modify {
      /**
       * 地址
       */
      addr?: string
      /**
       * 头像
       */
      avatar?: string
      /**
       * 生日
       */
      birthDay?: number
      /**
       * 禁用状态
       */
      enabled?: number
      /**
       * 自我介绍
       */
      intro?: string
      /**
       * 上次登录时间
       */
      lastLoginDate?: number
      /**
       * 密码
       */
      loginPwd?: string
      /**
       * 邮箱
       */
      mail?: string
      /**
       * 昵称
       */
      nickname?: string
      /**
       * 在线状态
       */
      online?: string
      /**
       * 手机号
       */
      phone?: string
      /**
       * QQ号
       */
      qq?: string
      /**
       * 用户类型
       */
      type?: string
      /**
       * 微信号
       */
      wechat?: string
    }

    // 获取用户信息
    interface Find {
      /**
       * 地址
       */
      addr?: string
      /**
       * 头像
       */
      avatar?: string
      /**
       * 生日
       */
      birthDay?: number
      /**
       * 禁用状态
       */
      enabled?: number
      /**
       * 自我介绍
       */
      intro?: string
      /**
       * 上次登录时间
       */
      lastLoginDate?: number
      /**
       * 用户id
       */
      loginId?: string
      /**
       * 密码
       */
      loginPwd?: string
      /**
       * 邮箱
       */
      mail?: string
      /**
       * 昵称
       */
      nickname?: string
      /**
       * 在线状态
       */
      online?: string
      /**
       * 手机号
       */
      phone?: string
      /**
       * QQ号
       */
      qq?: string
      /**
       * 用户类型
       */
      type?: string
      /**
       * 微信号
       */
      wechat?: string
    }
  }

  declare namespace Captcha {
    // 检查验证码
    interface Validate {
      /**
       * 验证码
       */
      captcha: string
    }
  }

  declare namespace Comment {
    export interface Add {
      /**
       * 评论内容
       */
      content: string
      /**
       * 搜寻id
       */
      sId: number
      /**
       * 是否审核通过
       */
      status?: boolean
      /**
       * 用户id
       */
      uId: string
    }

    export interface Get {
      /**
       * 评论id
       */
      commentId: number
      commentReplys?: Array<{
        /**
         * 评论回复id
         */
        commentReplyId: number
        /**
         * 评论回复内容
         */
        content: string
        /**
         * 创建时间
         */
        createdAt: string
        /**
         * 是否审核通过
         */
        status: boolean
        /**
         * 用户id
         */
        uId: string
      }>
      /**
       * 评论内容
       */
      content: string
      /**
       * 创建时间
       */
      createdAt: string
      /**
       * 删除时间
       */
      deletedAt?: null | string
      /**
       * 搜寻id
       */
      sId: number
      /**
       * 是否审核通过
       */
      status: boolean
      /**
       * 用户id
       */
      uId: string
      /**
       * 更新时间
       */
      updatedAt: string
    }
  }

  declare namespace News {
    export interface Get {
      /**
       * 管理员id
       */
      aId: string
      /**
       * 内容
       */
      content: string
      /**
       * 创建时间
       */
      createdAt: string
      /**
       * 删除时间
       */
      deletedAt?: null | string
      /**
       * 是否重要
       */
      important: boolean
      /**
       * 新闻id
       */
      newId: number
      newImgs: Array<{
        imgUrl: string
        newImgId: number
      }>
      /**
       * 浏览数
       */
      scanNumber: number
      /**
       * 标题
       */
      title: string
      /**
       * 更新时间
       */
      updatedAt: string
    }
  }

  declare interface ServerResponse {
    code: number
    msg: string
    data: {
      datas: [] | {}
      count?: number
    } | null
  }
}
