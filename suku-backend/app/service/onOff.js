'use strict';

const BaseService = require('../core/baseService');

class OnOffService extends BaseService {
  // 获取验证码
  async getWxControllerSimOnOff() {
    const code = await this.app.model.OnOff.findByPk('wx_controller_sim');
    return code.value;
  }

}

module.exports = OnOffService;
