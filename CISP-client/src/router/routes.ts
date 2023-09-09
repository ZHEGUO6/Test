import type {RouteRecordRaw} from "vue-router";
import {RouteMeta} from "@/types/route";

type RouteRecord = RouteRecordRaw&{
    meta:RouteMeta
}

const routes: readonly RouteRecord[]=[
    {
        path: '/',
        name: 'home',
        component:() => import('@/views/homePage.vue'),
        meta:{
            layout:true
        }
    },
    {
        path: '/friend',
        name: 'friend',
        component: () => import('@/views/Friend/friendPage.vue'),
        // children:[
        //     {
        //         path:'/',
        //         name:'',
        //         component:()=>import('@/views/Friend/'),
        //     }
        // ],
        meta:{
            layout:true
        }
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/searchPage.vue'),
        meta:{
            layout:true
        }
    },
    {
        path: '/bulletin',
        name: 'bulletin',
        component: () => import('@/views/bulletinBoard.vue'),
        meta:{
            layout: true
        }
    },
    {
        path: '/news',
        name: 'news',
        component: () => import('@/views/newsPage.vue'),
        meta:{
            auth:true,
            layout:true
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settingPage.vue'),
        meta:{
            auth:true,
            layout:true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: ()=>import('@/views/loginAndRegistryPage.vue'),
        meta:{
            layout:false
        }
    }
];

export  default  routes;