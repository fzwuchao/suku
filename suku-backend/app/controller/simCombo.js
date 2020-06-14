'use strict';

const BaseController = require('../core/baseController');

class SimComboController extends BaseController {
  async getSimComboByComboType() {
    const { ctx } = this;
    const { service, request, helper } = ctx;
    const { simCombo } = helper.rules;
    const rule = {
      ...simCombo([ 'comboType' ]),
    };

    const params = request.query;
    ctx.validate(rule, params);
    const result = await service.simCombo.getSimComboByComboType(params.comboType);
    this.success(result, '');
  }

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
    const comboTypeStr = request.body.comboType;
    const commonAttrs = [
      'name',
      'belongsToSimType',
      'comboType',
    ];
    let comboTypeAttrs = [];
    // 激活套餐
    // 非激活套餐（叠加套餐、特惠套餐，只包含套餐名和适用类型）
    if (comboTypeStr === '1') {
      comboTypeAttrs = [
        'monthFlow',
        'monthVoice',
        'monthRent',
        'months',
        'renewPrice',
      ];
    }

    const attrs = commonAttrs.concat(comboTypeAttrs);
    // 更新操作，要用到id
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
      ...simCombo([ 'id' ]),
    };

    const params = request.query;
    ctx.validate(rule, params);
    const result = await service.simCombo.getSimComboById(params.id);
    this.success(result, '');
  }
  async getSimComboByIds() {
    const { ctx } = this;
    const { service, request } = ctx;
    const rule = {
      ids: {
        type: 'array',
        itemType: 'string',
      },
    };
    ctx.validate(rule, request.body);
    const { ids } = request.body;
    for (let i = 0; i < ids.length; i++) {
      ids[i] = ids[i] - 0;
    }
    const result = await service.simCombo.getSimComboByIds(ids);
    this.success(result, '');
  }
}
module.exports = SimComboController;
