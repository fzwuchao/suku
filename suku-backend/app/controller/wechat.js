'use strict';

const BaseController = require('../core/baseController');

class WechatController extends BaseController {

  async getOpenId() {
    const { ctx } = this;
    const { service, request } = ctx;
    const { code } = request.query;
    const res = await service.wechat.getOpenId(code);
    this.success(res, '');
  }

}
module.exports = WechatController;
