'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {
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
