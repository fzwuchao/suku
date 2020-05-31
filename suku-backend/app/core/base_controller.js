'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {
  success(data, msg) {
    this.ctx.body = {
      success: true,
      data,
      msg,
    };
  }

  fail(data, msg) {
    this.ctx.body = {
      success: false,
      data,
      msg,
    };
  }

}

module.exports = BaseController;
