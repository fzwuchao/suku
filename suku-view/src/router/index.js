import Vue from 'vue'
import Router from 'vue-router'
import {
    adminMap
} from './admin'
import {
    bussinessMap
} from './bussiness'
import common from './common'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export const constantRouterMap = common
export const asyncRouterMap = adminMap.concat(bussinessMap)
const router = new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})
export default router