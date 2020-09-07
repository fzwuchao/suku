'use strict';

const BaseController = require('../core/baseController');

class ErrorLogController extends BaseController {

  async getErrorLogs() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const pageRules = helper.rules.pageRules;
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    const rule = {
      status: {
        type: 'string?',
      },
      name: 'string?',
      ...pageRules,
    };
    ctx.validate(rule, request.query);
    const { pageNum, pageSize, name, status, params } = request.query;
    const result = await ctx.service.errorLog.getErrorLogPage(pageSize, pageNum, status, name, params);
    this.success(result, '');
  }
  async deal() {
    const { ctx } = this;
    const { request } = ctx;
    const rule = {
      ids: {
        type: 'array',
        itemType: 'int',
      },
      isExec: {
        type: 'int',
      },
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.body);
    const { ids, isExec } = request.body;
    const result = await ctx.service.errorLog.bulkUpdate(ids, isExec, 'isExec');
    this.success(result, '');
  }
}
module.exports = ErrorLogController;
