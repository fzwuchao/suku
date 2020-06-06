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

}
module.exports = ComboPackController;
