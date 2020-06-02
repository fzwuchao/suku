/* eslint-disable dot-notation */
'use strict';

/**
 */
const BaseService = require('../core/baseService');

class SimService extends BaseService {
  /**
   * sim卡列表
   * @param { object } - 参数对象如下：
   * object : {
   *  {string} simId - sim卡号
   *  {array} simIdRange - sim卡段号
   *  {string} username - 用户
   *  {int} netStatus - 状态
   *  {int} isActive - 激活状态
   *  {int} pageSize - 每页条数
   *  {int} pageNo - 页码
   * }
   * @return {{count, rows}} - 总条数，一页的数据
   */
  async getSimPageData({ simId, simIdRange, username, netStatus, isActive, pageSize, pageNum }) {
    const { Sequelize: { Op } } = this.app.model;
    const condition = {};

    if (simId !== undefined) {
      condition['simId'] = {
        [Op.substring]: simId,
      };
    }

    if (simIdRange && simIdRange.length > 0) {
      if (simId !== undefined) {
        condition['simId'] = {
          [Op.or]: {
            [Op.substring]: simId,
            [Op.between]: simIdRange,
          },
        };
      } else {
        condition['simId'] = {
          [Op.between]: simIdRange,
        };

      }
    }

    if (username !== undefined) {
      condition['username'] = {
        [Op.substring]: username,
      };
    }

    if (netStatus !== undefined) {
      condition['netStatus'] = {
        [Op.eq]: netStatus,
      };
    }

    if (isActive !== undefined) {
      condition['isActive'] = {
        [Op.eq]: isActive,
      };
    }

    const simData = await this.findAndCountAll('Sim', pageSize, pageNum, condition);

    return simData;
  }

  /**
   * 批量创建sim卡
   * @param {array} simList - 数组
   * @return {boolean} - true表示创建成功，false表示创建失败
   */
  async bulkCreate(simList) {
    const { Sim } = this.app.model;
    const sims = await Sim.bulkCreate(simList);
    return sims.length === simList.length;
  }

}

module.exports = SimService;
