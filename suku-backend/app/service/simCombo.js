/* eslint-disable dot-notation */
'use strict';

const BaseService = require('../core/baseService');

class SimComboService extends BaseService {
  /**
   * 获取套餐信息
   * @param {object} - 参数对像
   * object: {
   *  simType: sim类型，主叫卡，被叫卡
   *  name: 套餐名称
   *  comboType: 套餐类型
   * } 
   */
  async getSimComboPageData({ simType, name, comboType, pageSize, pageNum }) {
    const { Sequelize: { Op } } = this.app.model;
    const condition = {};

    if (simType !== undefined) {
      condition['simType'] = {
        [Op.eq]: simType,
      };
    }

    if (name !== undefined) {
      condition['name'] = {
        [Op.substring]: name,
      };
    }

    if (comboType !== undefined) {
      condition['comboType'] = {
        [Op.eq]: comboType,
      };
    }

    const result = await this.findAndCountAll('SimCombo', pageSize, pageNum, condition);

    return result;
  }

}

module.exports = SimComboService;
