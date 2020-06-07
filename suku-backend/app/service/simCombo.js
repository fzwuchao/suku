/* eslint-disable no-trailing-spaces */
/* eslint-disable dot-notation */
'use strict';

const BaseService = require('../core/baseService');
const _ = require('lodash');
class SimComboService extends BaseService {
  /**
   * 获取套餐信息
   * @param {object} - 参数对像
   * object: {
   *  belongsToSimType: 适用sim类型
   *  name: 套餐名称
   *  comboType: 套餐类型
   * } 
   */
  async getSimComboPageData({ belongsToSimType, name, comboType, pageSize, pageNum }) {
    const { Sequelize: { Op } } = this.app.model;
    const condition = {};

    if (!_.isUndefined(belongsToSimType)) {
      condition['belongsToSimType'] = {
        [Op.substring]: belongsToSimType,
      };
    }

    if (!_.isUndefined(name)) {
      condition['name'] = {
        [Op.substring]: name,
      };
    }

    if (!_.isUndefined(comboType)) {
      condition['comboType'] = {
        [Op.eq]: comboType,
      };
    }

    const whereCondition = {};

    if (Object.keys(condition).length > 0) whereCondition.where = condition;

    const result = await this.findAndCountAll('SimCombo', pageSize, pageNum, whereCondition);

    return result;
  }

  async save(params) {
    try {
      if (params.id !== undefined) {
        const id = params.id;
        delete params.id;
        await this.app.model.SimCombo.update(params, { where: { id } });
      } else {
        await this.app.model.SimCombo.create(params);
      }
      return true;
    } catch (error) {
      this.ctx.logger.error(`【创建SimCombo失败-失败原因】${error.message}`);
      return false;
    }

  }

  async getSimComboById(id) {
    const result = await this.app.model.SimCombo.findByPk(id);
    return result;
  }
}

module.exports = SimComboService;
