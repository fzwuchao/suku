'use strict';

const BaseController = require('../core/baseController');

class SimController extends BaseController {
  // 创建
  async save() {
    const { ctx } = this;
    const { request, service } = ctx;
    const { simId, activeMenuName } = request.body;
    let state = null;
    let err = null;
    try {
      state = await service.sim.bulkCreate([{ simId, activeMenuName }]);
    } catch (error) {
      err = error;
      ctx.logger.error(error);
    }

    if (state) {
      this.success(null, '创建成功');
    } else {
      this.fail(null, `${err ? err.message : '创建失败'}`);
    }

  }

  // 查询
  async search() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { pageRules, sim } = helper.rules;

    const rule = {
      ...sim(),
      ...pageRules,
    };

    const params = Object.keys(rule).reduce((acc, cur) => {
      if (cur in request.query || cur in request.queries) {
        acc[cur] = rule[cur].type.includes('array') ? request.queries[`${cur}`] : request.query[cur];
      }
      return acc;
    }, {});

    ctx.validate(rule, params);
    const pageData = await service.sim.getSimPageData(params);
    this.success(pageData, '');
  }

}
module.exports = SimController;
