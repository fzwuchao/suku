'use strict';

/**
 * 验证码服务
 * https://github.com/produck/svg-captcha
 */
const BaseService = require('../core/baseService');
const svgCaptcha = require('svg-captcha');

class CaptchaService extends BaseService {
  // 获取验证码
  async getCaptcha() {
    const captcha = svgCaptcha.create({ width: 100, height: 35 });
    // this.ctx.session.captcha = captcha;

    return captcha;
  }

  // 校验验证码
  async diffCaptcha(captcha) {
    return this.ctx.session.captcha.toLowerCase() === captcha.toLowerCase();
  }
}

module.exports = CaptchaService;
