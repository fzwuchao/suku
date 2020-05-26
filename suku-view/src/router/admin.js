const _import = require('./_import_prodtest.js')

import Layout from '../views/layout/Layout'
// 嵌套路由
export const adminMap = [
  {
    path: '/',
    component: Layout,
    name: '首页',
    redirect: '/demand/list',
    children: [],
    hidden: true
  }, {
    path: '/demand',
    component: Layout,
    name: '受捐赠管理',
    redirect: '/demand/list',
    showChild: false,
    meta: {
      title: '受捐赠管理',
      icon: 'table',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        name: '受捐赠管理',
        component: _import('demand/list'),
        meta: {
          title: '受捐赠管理',
          icon: 'tree',
          role: ['admin', 'editor']
        }
      }, {
        path: 'demanddetail/:id',
        name: '受捐赠详情',
        component: _import('demand/demanddetail'),
        hidden: true,
        meta: {
          title: '受捐赠详情',
          icon: 'table',
          role: ['admin', 'editor']
        }
      }, {
        path: 'addDemand',
        name: '新增受捐赠信息',
        component: _import('demand/addDemand'),
        hidden: true,
        meta: {
          title: '新增受捐赠信息',
          icon: 'table',
          role: ['admin', 'editor']
        }
      }
    ]
  }, {
    path: '/donate',
    component: Layout,
    name: '捐赠信息',
    redirect: '/donate/list',
    showChild: false,
    meta: {
      title: '捐赠管理',
      icon: 'tree',
      role: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        name: '捐赠管理',
        component: _import('donate/list'),
        meta: {
          title: '捐赠管理',
          icon: 'table',
          role: ['admin', 'editor']
        }
      }, {
        path: 'donatedetail/:id',
        name: '捐赠详情',
        component: _import('donate/donatedetail'),
        hidden: true,
        meta: {
          title: '捐赠详情',
          icon: 'table',
          role: ['admin', 'editor']
        }
      }
    ]
  }
]
