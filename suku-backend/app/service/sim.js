/* eslint-disable dot-notation */
'use strict';

/**
 */
const Service = require('egg').Service;

class SimService extends Service {
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
  async getSimPageData({ simId, simIdRange, username, netStatus, isActive, pageSize, pageNo }) {
    const { Sequelize: { Op }, Sim } = this.app.model;
    const condition = {};

    if (simId !== undefined) {
      condition['simId'] = {
        [Op.substring]: simId,
      };
    }

    if (simIdRange && simIdRange.length > 0) {
      condition['simId'] = [
        ...condition['simId'],
        {
          [Op.between]: simIdRange,
        },
      ];
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

    const whereCondition = {};

    if (Object.keys(condition).length > 0) {
      whereCondition.where = {
        ...condition,
      };
    }

    // 分页
    // 如: {offset: 10, limit: 5}: 跳过前10条，获取之后的5条数据
    const pagnation = {
      offset: pageSize * (pageNo - 1),
      limit: pageSize,
    };
    const params = { ...whereCondition, ...pagnation };
    const simData = await Sim.findAndCountAll(params);

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
