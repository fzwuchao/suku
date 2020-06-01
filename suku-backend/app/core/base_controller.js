'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {
  success(data, msg, otherParams) {
    this.ctx.body = {
      success: true,
      data,
      msg,
      ...otherParams,
    };
  }

  fail(data, msg, otherParams) {
    this.ctx.body = {
      success: false,
      data,
      msg,
      ...otherParams,
    };
  }

}

module.exports = BaseController;
