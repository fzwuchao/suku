'use strict';

const BaseController = require('../core/baseController');

class LoginController extends BaseController {
  // 登录
  async login() {
    const { ctx } = this;
    const { service, helper } = ctx;
    // 用户名、密码、验证码
    const { username, password, captchaCode } = ctx.request.body;

    // 取得session中的验证码，对比用户传过来的
    const isSameCaptcha = await service.captcha.diffCaptcha(captchaCode);
    if (!isSameCaptcha) {
      this.fail(1002, null, '验证码错误');
      return;
    }

    const user = await service.user.getLoginUser(username, password);

    if (user) {
      const roleType = await service.role.getRoleTypeById(user.roleId);
      const loginUserInfo = helper.loginUser.create(user.id, user.username, user.name, user.roleId, roleType);

      ctx.cookies.set('loginUserInfo', helper.loginUser.stringfy(loginUserInfo), {
        httpOnly: false,
      });

      const token = await ctx.service.token.getToken(username);

      if (token === null) {
        this.fail(1002, null, 'token设置失败');
      } else {
        this.success(loginUserInfo, '登录成功', { token });
      }

      return;
    }

    this.fail(1002, null, '用户名或密码错误');
  }

  // 退出
  async logout() {
    const { ctx } = this;
    const { cookies } = ctx;
    const loginUserInfo = JSON.parse(decodeURIComponent(cookies.get('loginUserInfo')));
    const username = loginUserInfo.username;
    await ctx.service.token.removeToken(username);
    this.success(null, '');
  }
}

module.exports = LoginController;
