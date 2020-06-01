import {
    constantRouterMap
} from '@/router'
import request from '@/utils/request'
import API from '@/api'
import common from '@/router/common'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {   if (route.meta && route.meta.role) {
//     return roles.some(role => route.meta.role.indexOf(role) >= 0)   } else {
//   return true   } }
const _import = require('../../router/_import_' + process.env.NODE_ENV)
import Layout from '../../views/layout/Layout'
/*
 * 根据后台回过来的菜单创建一个路由
 */
function createRouter(item) {
    const router = {
        path: `${item.menuUrl}`,
        name: item.menuName,
        meta: {
            title: item.menuName,
            icon: 'f'
        }
    }
    if (item.menuIcon) {
        router.meta.icon = item.menuIcon
    }
    if (item.redirect) {
        router.redirect = item.redirect
    }
    // if (!item.subMenuList || item.subMenuList.length === 0) {
    if (item.menuView) {
        router.component = _import(item.menuView)
    } else if (item.subMenuList && item.subMenuList.length > 0) {
        router.component = Layout
        router.showChild = true
    }
    if (item.props) {
        router.props = JSON.parse(item.props)
    }
    if (item.activeName) {
        router.meta.activeName = item.activeName
    }
    if (item.menuType == 2) {
        router.hidden = true
    }
    return router
}

/**
 * 得到所有的路由结构
 * @param routers
 * @param menu
 * @param preUrl
 * @returns {*}
 */
function getRouters(routers, menu) {
    for (let i = 0; i < menu.length; i++) {
        let item = {}
        menu[i].menuPath = `${menu[i].menuUrl}`
        item = createRouter(menu[i])
        menu[i].subMenuList = menu[i].subMenuList || []
        if (menu[i].subMenuList && menu[i].subMenuList.length > 0) {
            item.children = []
            getRouters(item.children, menu[i].subMenuList)
            item.redirect = menu[i].subMenuList[0].menuPath
        }
        routers.push(item)
    }
    return routers
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        homeRedirect: '/'
    },
    mutations: {
        RESET_PERMISSION: (state) => {
            state.routers = constantRouterMap
            state.addRouters = []
        },
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        },
        SET_HOMEREDIRECT: (state, path) => {
            state.homeRedirect = path
        }
    },
    actions: {
        GenerateRoutes({
            commit
        }) {
            return new Promise((resolve, rj) => {
                request({
                    url: API.PERMISSION.GET_PERMISSION,
                    method: 'get',
                    data: {}
                }).then(response => {
                    let data = response.data.data
                    let accessedRouters = []
                    getRouters(accessedRouters, data, '')
                    let redirect = accessedRouters[0].path
                        /* if (accessedRouters.length > 1) {
                            redirect = accessedRouters[1].path
                        } */
                    let router = {
                        path: '/',
                        component: Layout,
                        name: '',
                        redirect: redirect,
                        hidden: true
                    }
                    if (accessedRouters.length === 0) {
                        router.redirect = '/homepage'
                    }

                    accessedRouters.push(router)
                    accessedRouters = accessedRouters.concat(common)
                    commit('SET_ROUTERS', accessedRouters)
                    resolve()
                }).catch(() => {
                    rj()
                })
            })
        }
    }
}

export default permission