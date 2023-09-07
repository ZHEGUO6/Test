
// 路由的 meta 属性
export interface RouteMeta{
    layout:boolean, // 是否启动布局
    hideInMenu?:boolean, //是否在菜单栏显示
    auth?:boolean // 是否需要登录验证,
}
