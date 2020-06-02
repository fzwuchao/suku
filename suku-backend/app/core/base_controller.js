'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {
  getCurUser() {

    const curUser = this.ctx.helper.loginUser.parse(this.ctx.cookies.get('loginUserInfo')) || {};
    return curUser;
  }
  success(data, msg, otherParams) {
    this.ctx.body = {
      code: 200,
      success: true,
      data,
      msg,
      ...otherParams,
    };
  }

  fail(code, data, msg, otherParams) {
    this.ctx.body = {
      code,
      success: false,
      data,
      msg,
      ...otherParams,
    };
  }

}

module.exports = BaseController;
