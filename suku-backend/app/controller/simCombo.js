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

  async save() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { simCombo } = helper.rules;

    const attrs = [
      'name',
      'belongsToSimType',
      'monthSumFlowThreshold',
      'monthSumFlowThresholdUnit',
      'monthVoiceDurationThreshold',
      'monthVoiceDurationThresholdUnit',
      'monthRent',
      'months',
      'renewPrice',
      'comboType',
    ];
    if (request.body.id) {
      attrs.push('id');
    }
    const rule = {
      ...simCombo(attrs),
    };

    const params = request.body;
    ctx.validate(rule, params);
    const result = await service.simCombo.save(params);
    result ? this.success(null, '创建成功') : this.fail('', '创建失败');
  }

  async getSimComboById() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { simCombo } = helper.rules;

    const rule = {
      ...simCombo(['id']),
    };

    const params = request.query;
    ctx.validate(rule, params);
    const result = await service.simCombo.getSimComboById(params.id);
    this.success(result, '');
  }
}
module.exports = SimComboController;
