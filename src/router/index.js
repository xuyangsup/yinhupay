import Vue from 'vue'
import Router from 'vue-router'
import { menu } from '../common/menu'

Vue.use(Router)


var menuList = [];

menu.forEach(data => {
    menuList.push({
        path: data.path,
        component: data.page,
        meta: { title: data.title }
    })
})

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: menuList
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})

