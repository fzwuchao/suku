import Axios from './request'
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install : function (Vue) {
    Object.defineProperty(Vue.prototype, 'axios', {value: Axios});
  }
};
