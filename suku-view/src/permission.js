import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import { Message } from 'element-ui'
import {
    getIsLogin
} from '@/utils/auth' // 验权
import GLOBAL from '@/utils/global'

const whiteList = GLOBAL.WHITELIST // 不重定向白名单
    // store.dispatch('LogOut')
router.beforeEach((to, from, next) => {
    // 将from.path保存  用于返回上一级
    sessionStorage.setItem('previousUrl', from.path)
    NProgress.start()
    if (whiteList.indexOf(to.path) !== -1) {
        // if (getIsLogin()) {   next('/')   NProgress.done() } else {
        //
        // }

        next()
        NProgress.done()
    } else if (getIsLogin()) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
        } else {
            if (store.getters.addRouters.length === 0) {
                // router.history.current.path = '/'
                store
                    .dispatch('GenerateRoutes', {})
                    .then(() => { // 生成可访问的路由表
                        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        if (from.path === '/login') {
                            let redirect = store.getters.addRouters[0].path
                            if (store.getters.addRouters.length > 1) {
                                redirect = store.getters.addRouters[1].path
                            }
                            let homeRedirect = store.getters.addRouters.length > 1 ?
                                redirect :
                                store.getters.addRouters[0].redirect
                            store.commit('SET_HOMEREDIRECT', homeRedirect)
                            next({
                                    path: homeRedirect
                                }) // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
                                // to.path = '/?' + new Date().getTime()
                        } else {
                            next({
                                    ...to,
                                    replace: true
                                }) // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
                        }
                    })
                    .catch(() => {
                        // Message({   message: '恭喜你，这是一条成功消息',   type: 'success' })
                        next('/login')
                    })
            } else {
                next()
            }
        }
    } else {
        next({
            path: '/login'
        })
        NProgress.done()
    }
})
router.afterEach(() => {
    NProgress.done() // 结束Progress
})