'use strict';

const BaseController = require('../core/baseController');

class SimLogisticsController extends BaseController {

  async getSimLogisticslist() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.pageRules;
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const { pageNum, pageSize } = request.query;
    const result = await ctx.service.simLogistics.getSimLogisticsPage(pageSize, pageNum);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { id } = request.body;
    let rule = null;
    if (!(id && id !== null)) {
      rule = helper.rules.simLogistics([ 'receiver', 'receiverId', 'total' ]);
      ctx.validate(rule, request.body);
    }
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    const simLogistics = request.body;
    if (id && id !== null) {
      const result = await ctx.service.simLogistics.update(simLogistics);
      this.success(result, '');
    } else {
      const result = await ctx.service.simLogistics.create(simLogistics);
      this.success(result, '');
    }
  }

  async getSimLogisticsById() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.simLogistics([ 'id' ]);
    ctx.validate(rule, request.query);
    const { id } = request.query;
    const result = await ctx.service.simLogistics.getUserById(id);
    this.success(result, '成功');
  }
}
module.exports = SimLogisticsController;
