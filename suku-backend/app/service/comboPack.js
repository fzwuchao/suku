/* eslint-disable dot-notation */
'use strict';

const BaseService = require('../core/baseService');
const _ = require('lodash');
class SimComboService extends BaseService {
  /**
   * 获取套餐包信息
   * @param {object} - 参数对像
   * object: {
   *  comboType: 套餐类型
   * } 
   */
  async getComboPackPageData({ comboType, name, pageSize, pageNum }) {
    const { Sequelize: { Op }, SimCombo } = this.app.model;
    const condition = {};

    if (!_.isUndefined(comboType)) {
      condition['comboType'] = {
        [Op.eq]: comboType,
      };
    }

    if (!_.isUndefined(name)) {
      condition['name'] = {
        [Op.substring]: name,
      };
    }

    let whereCondition = {};

    if (Object.keys(condition).length > 0) {
      whereCondition = {
        where: condition,
        include: {
          model: SimCombo,
          as: 'simCombo',
        },
      };

    }

    const result = await this.findAndCountAll('ComboPack', pageSize, pageNum, whereCondition);

    return result;
  }

}

module.exports = SimComboService;
