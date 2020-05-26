import Axios from './request'
export default {
  install : function (Vue) {
    Object.defineProperty(Vue.prototype, 'axios', {value: Axios})
  }
}
