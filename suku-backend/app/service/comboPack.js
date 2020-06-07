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

  async save(params) {
    try {
      if (params.id !== undefined) {
        const id = params.id;
        delete params.id;
        await this.app.model.ComboPack.update(params, { where: { id } });
      } else {
        await this.app.model.ComboPack.create(params);
      }
      return true;
    } catch (error) {
      this.ctx.logger.error(`【创建套餐包失败-失败原因】${error.message}`);
      return false;
    }

  }

  async getComboPackById(id) {
    const result = await this.app.model.ComboPack.findByPk(id);
    return result;
  }
}

module.exports = SimComboService;
