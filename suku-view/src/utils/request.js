import axios from 'axios'
import qs from 'qs'
import {
    Message,
    Loading,
    MessageBox
} from 'element-ui'
import router from '../router'
// import MsgInner from 'MsgInner'
import {
    removeIsLogin,
    getToken
} from './auth'

const Axios = axios.create({
    baseURL: '/', // 因为我本地做了反向代理
    timeout: 10000,
    responseType: 'json',
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})
let loading = null
let hideError = false
    // POST传参序列化(添加请求拦截器)
    /**
     * post方式，application / json，参数不序列化 —method : post
     * get方式，application / json，参数不序列化—method : get
     * post方式，application / x - www - form - urlencoded，参数序列化—method : form
     * 满足这三种方式的接口以后不用传contentType参数。只需要配置对应的method
     * loadEl：需要显示加载状态的框
     * loading： 是否显示加载状态
     * hideError： 后台抛出错误信息的时候是否直接弹窗显示
     * loadingTxt： 加载状态的文字显示，默认显示加载中...
     * contentType : 设置请求头传输类型 application / json  application / x - www - form - urlencoded
     */
Axios
    .interceptors
    .request
    .use(config => {
        if (config.method === 'put' || config.method === 'delete') {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
            config.data = qs.stringify(config.data || {})
        } else if (config.method === 'form') {
            config.method = 'post'
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
            config.data = qs.stringify(config.data || {})
        } else {
            config.data = config.data || {}
        }

        if ((typeof config.loading) === 'undefined' || config.loading) {
            if (!loading) {
                if (config.loadfullscreen) {
                    loading = Loading.service({
                        fullscreen: true,
                        text: (config.loadingTxt || '加载中...')
                    })
                } else {
                    if (config.loadEl) {
                        loading = Loading.service({
                            target: config.loadEl,
                            text: (config.loadingTxt || '加载中...')
                        })
                    }
                }
            }
        }
        if (config.hideError) {
            hideError = config.hideError
        } else {
            hideError = false
        }
        if (config.contentType) {
            config.headers['Content-Type'] = config.contentType
        }

        // 加上csrf token
        config.headers['x-csrf-token'] = getToken()
        return config
    }, error => {
        if (loading) {
            loading.close()
            loading = null
        }
        Message({
            //  饿了么的消息弹窗组件,类似toast
            showClose: true,
            message: error,
            type: 'error.data.error.message'
        })
        return Promise.reject(error.data.error.message)
    })

// 返回状态判断(添加响应拦截器)
Axios
    .interceptors
    .response
    .use(res => {
      debugger
        if (loading) {
            loading.close()
            loading = null
        }
        if (res.data && res.data.code !== 200) {
            if (res.data.code === 1001) {
                removeIsLogin()
                router.push({
                    path: '/login'
                })
            } else if (res.data.code === 500) {
                if (!hideError) {
                    MessageBox.alert(res.data.msg)
                }
            } else {
                if (res.data.code && !hideError) {
                    MessageBox.alert(res.data.msg)
                }
            }
        }
        return res.data
    }, (error) => {
        if (loading) {
            loading.close()
            loading = null
        }
        if (!error.response) {
            router.push({
                path: '/login'
            })
        }
        if (error.response && error.response.status === 404) {
            router.push({
                path: '/404'
            })
        }
        // 返回 response 里的错误信息
        const errorData = error.response.data
        let errorInfo = null
        if (errorData) {
            errorInfo = errorData.error
        }
        return Promise.reject(errorInfo || '')
    })

export default Axios