'use strict';

const BaseController = require('../core/baseController');

class ComboPackController extends BaseController {
  async search() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { pageRules, comboPack } = helper.rules;

    const rule = {
      ...comboPack(),
      ...pageRules,
    };

    const params = request.query;
    ctx.validate(rule, params);
    const result = await service.comboPack.getComboPackPageData(params);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { comboPack } = helper.rules;
    const attrs = [
      'name',
      'comboId',
    ];

    // 更新操作，要用到id
    if (request.body.id) {
      attrs.push('id');
    }
    const rule = {
      ...comboPack(attrs),
    };

    const params = request.body;
    ctx.validate(rule, params);
    const result = await service.comboPack.save(params);
    result ? this.success(null, '创建成功') : this.fail('', '创建失败');
  }

  async getComboPackById() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { comboPack } = helper.rules;

    const rule = {
      ...comboPack([ 'id' ]),
    };

    const params = request.query;
    ctx.validate(rule, params);
    const result = await service.comboPack.getComboPackById(params.id);
    this.success(result, '');
  }

}
module.exports = ComboPackController;
