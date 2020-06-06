'use strict';

const BaseController = require('../core/baseController');

class SimComboController extends BaseController {
  async search() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { pageRules, simCombo } = helper.rules;

    const rule = {
      ...simCombo(),
      ...pageRules,
    };

    const params = request.query;
    ctx.validate(rule, params);
    const result = await service.simCombo.getSimComboPageData(params);
    this.success(result, '');
  }

}
module.exports = SimComboController;
