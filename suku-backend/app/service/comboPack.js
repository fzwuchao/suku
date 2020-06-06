/* eslint-disable dot-notation */
'use strict';

const BaseService = require('../core/baseService');
const _ = require('lodash');
class SimComboService extends BaseService {
  /**
   * 获取套餐包信息
   * @param {object} - 参数对像
   * object: {
   *  comboId: 套餐id
   * } 
   */
  async getComboPackPageData({ comboId, pageSize, pageNum }) {
    const { Sequelize: { Op }, SimCombo, ComboPack } = this.app.model;
    const condition = {};

    if (!_.isUndefined(comboId)) {
      condition['comboId'] = {
        [Op.eq]: comboId,
      };
    }

    SimCombo.hasMany(ComboPack, { foreignKey: 'comboId' });
    ComboPack.belongsTo(SimCombo, {
      // as: 'SimCombo',
      foreignKey: 'comboId',
    });

    let whereCondition = {};

    if (Object.keys(condition).length > 0) {
      whereCondition = {
        where: condition,
        include: [{
          model: SimCombo,
        }],
      };

    }

    const result = await this.findAndCountAll('ComboPack', pageSize, pageNum, whereCondition);

    return result;
  }

}

module.exports = SimComboService;
