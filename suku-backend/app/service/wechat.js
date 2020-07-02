'use strict';

const BaseService = require('../core/baseService');
const { WX_CONFIG, API } = require('../extend/wechat')();

class WechatService extends BaseService {
  async fetchData(url, data, options) {
    const res = await this.ctx.curl(`${url}`, {
      data,
      dataType: 'json',
      ...options,
    });
    return res;
  }

  async getOpenId(code) {
    const data = {};
    data.appid = WX_CONFIG.APPID;
    data.code = code;
    data.secret = WX_CONFIG.APPSECRET;
    data.grant_type = 'authorization_code';
    const res = await this.ctx.curl(`${API.ACCESS_TOKEN}`, {
      data,
      dataType: 'json',
    });
    return res;
  }

}
module.exports = WechatService;
