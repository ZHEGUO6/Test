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
      content?: string
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
    interface Add {
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

    interface Modify {
      /**
       * 是否审核通过
       */
      status: string
    }

    interface Get {
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
    type GetCount = Array<{ count: number; important: boolean }>
    interface GetInfo {
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
       * 是否重要
       */
      important?: boolean
      /**
       * 浏览数
       */
      scanNumber?: number
      /**
       * 标题
       */
      title: string
      [property: string]: any
    }

    interface ModifyCount {
      scanNumber: number
    }
  }

  declare namespace Search {
    interface Get {
      /**
       * 评论数
       */
      commentNumber: number
      /**
       * 创建时间
       */
      createdAt: string
      /**
       * 删除时间
       */
      deletedAt?: null | string
      /**
       * 内容
       */
      intro: string
      /**
       * 浏览数
       */
      scanNumber: number
      /**
       * 寻人寻物id
       */
      searchId: number
      searchImgs: Array<{
        /**
         * 图片url
         */
        imgUrl: string
        /**
         * 搜寻id
         */
        sId: string
      }>
      /**
       * 标题
       */
      title: string
      /**
       * 类型，0 表示寻人，1表示交友
       */
      typeId: number
      /**
       * 用户id
       */
      uId: string
      /**
       * 更新时间
       */
      updatedAt: string
    }

    interface Add {
      /**
       * 评论数
       */
      commentNumber?: number
      /**
       * 内容
       */
      intro: string
      /**
       * 浏览数
       */
      scanNumber?: number
      /**
       * 标题
       */
      title: string
      /**
       * 类型，0 表示寻人，1表示交友
       */
      typeId?: number
      /**
       * 用户id
       */
      uId: string
    }

    interface ModifyCount {
      /**
       * 评论数
       */
      commentNumber?: number
      /**
       * 浏览数
       */
      scanNumber?: number
    }
  }

  declare namespace SearchImg {
    interface Add {
      /**
       * 图片url
       */
      imgUrl: string
      /**
       * 搜寻id
       */
      sId: string
    }
  }

  declare namespace Group {
    interface Get {
      /**
       * 创建时间
       */
      createdAt: string
      /**
       * 删除时间
       */
      deletedAt?: null | string
      /**
       * 该分组下的朋友数量
       */
      friends?: number
      /**
       * 分组id
       */
      groupId: string
      /**
       * 分组名
       */
      name: string
      /**
       * 用户id
       */
      uId: string
      /**
       * 更新时间
       */
      updatedAt: string
    }

    interface Add {
      /**
       * 分组名
       */
      name: string
      /**
       * 用户id
       */
      uId: string
    }

    interface Modify {
      /**
       * 分组名
       */
      name: string
    }
  }

  declare namespace Friend {
    interface Get {
      /**
       * 创建时间
       */
      createdAt: string
      /**
       * 删除时间
       */
      deletedAt?: null | string
      /**
       * 用户朋友id
       */
      fId: string
      /**
       * 主键id
       */
      friendId: string
      /**
       * 分组id
       */
      gId: string
      /**
       * 相识时间
       */
      makeDate: string
      /**
       * 备注
       */
      note: string
      /**
       * 用户id
       */
      uId: string
      /**
       * 更新时间
       */
      updatedAt: string
    }

    interface Add {
      /**
       * 用户朋友id
       */
      fId: string
      /**
       * 分组id
       */
      gId: string
      /**
       * 备注
       */
      note: string
      /**
       * 用户id
       */
      uId: string
    }

    interface Modify {
      /**
       * 备注
       */
      note?: string
      gId?: number
    }
  }

  declare namespace Notice {
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
       * 公告id
       */
      noticeId: number
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

    interface ModifyCount {
      scanNumber: number
    }

    interface Add {
      /**
       * 管理员id
       */
      aId: string
      /**
       * 内容
       */
      content?: string
      /**
       * 是否重要
       */
      important?: boolean
      /**
       * 浏览数
       */
      scanNumber?: number
      /**
       * 标题
       */
      title: string
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
