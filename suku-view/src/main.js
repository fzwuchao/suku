import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import axios from './utils/axiosPlugin'
import echarts from 'echarts'

// import './mock' // 该项目所有请求使用mockjs模拟

Vue.use(axios)
Vue.use(ElementUI, {
    size: 'small'
});

import '@/svg';
import SvgIcon from '@/components/SvgIcon';
import '@/permission' // permission control
Vue.component('SvgIcon', SvgIcon);
// console.log(router)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");