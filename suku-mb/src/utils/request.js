/**
 * 参数： loading 默认值true
 *        hideError 关闭默认的错误提示  默认值false
 */
import axios from 'axios';

import { Toast } from 'vant';
// import router from '../router';

let hideError = false;
const Axios = axios.create({
    baseURL: '/',
    timeout: 10000,
    responseType: 'json',
    withCredentials: false, // 是否允许带cookie这些
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'api-key': 'HUVMvFfi8dXL=O5pwByQHDknMXM='
    },
    loading: true,
    hideError: false
});

// POST传参序列化(添加请求拦截器)
Axios
    .interceptors
    .request
    .use(config => {

        /* if ((config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
          config.data = qs.stringify(config.data);
        } */
        if (config.loading) {
            Toast({ duration: 0, message: '正在加载...' });
        }
        if (config.hideError) {
            hideError = config.hideError;
        }
        if (config.contentType) {
            config.headers.post['Content-Type'] = config.contentType;
            // config.headers['Content-Type'] = config.contentType;
        }
        // 若是有做鉴权token , 就给头部带上token
        if (localStorage.token) {
            config.headers.Authorization = localStorage.token;
        }
        config.url = `/api${config.url}`
        return config;
    }, error => {
        if (!hideError) {
            Toast('加载失败请稍后重试');
        }
        return Promise.reject(error.data.error.message);
    });

// 返回状态判断(添加响应拦截器)
Axios
    .interceptors
    .response
    .use(res => {
        Toast.clear();
        if (res.data && (res.data.code !== 200) && !res.data.features) {
            if (!hideError) {
                Toast(res.data.msg);
            }
            return Promise.reject(res.data);
        } else {
            return res.data;
        }
    }, error => {
        Toast.clear();
        if (!hideError) {
            Toast('加载失败请稍后重试');
        }
        return Promise.reject(error);
    });
export default Axios