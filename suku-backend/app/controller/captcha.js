'use strict';

const BaseController = require('../core/base_controller');

class CaptchaController extends BaseController {
  // 获取验证码
  async getCaptcha() {
    const { ctx } = this;
    const { response, session, service } = ctx;
    const captcha = await service.captcha.getCaptcha();
    // 验证码放到session中
    session.captcha = captcha.text;
    ctx.logger.info('【验证码】:', session.captcha);
    response.type = 'image/svg+xml';
    this.success(captcha.data, '获取验证码成功');
  }

}
module.exports = CaptchaController;
