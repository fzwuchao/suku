/* eslint-disable dot-notation */
'use strict';

/**
 */
const BaseService = require('../core/baseService');

class SimService extends BaseService {
  async getSimBySimId(simId) {
    // const attributes = [ 'simId', 'iccid', 'simType', 'activeMenuId', 'activeMenuName', 'otherMenuIds', 'activeTime', 'overdueTime' ];
    const [ sim ] = await this.app.model.Sim.findAll({
      where: {
        simId,
      },
    });

    return sim;
  }

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
  async getSimPageData({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName, pageSize, pageNum }) {
    const whereCondition = this.getWhereCondition({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName });
    const simData = await this.findAndCountAll('Sim', pageSize, pageNum, whereCondition);

    return simData;
  }

  getWhereCondition({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName }) {
    const Op = this.getOp();
    const condition = {};

    if (simId !== undefined) {
      condition['simId'] = {
        [Op.substring]: simId,
      };
    }

    if (simIdRange && simIdRange.length > 0) {
      if (simId !== undefined) {
        condition['simId'] = {
          [Op.and]: {
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

    if (simType !== undefined) {
      condition['simType'] = {
        [Op.eq]: simType,
      };
    }

    if (activeMenuName !== undefined) {
      condition['activeMenuName'] = {
        [Op.substring]: activeMenuName,
      };
    }

    const whereCondition = {};

    if (Object.keys(condition).length > 0) whereCondition.where = condition;

    return whereCondition;
  }

  async getSimDataForExcel({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName }, simTypeIsB) {
    const whereCondition = this.getWhereCondition({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName });
    const commonAttrs = [
      [ 'sim_id', 'Sim卡号' ],
      // [ 'net_status', '状态' ],
      [ 'flow_serv_status', '流量服务关停状态' ],
      [ 'active_menu_name', '激活套餐名' ],
      [ 'active_time', '激活时间' ],
      [ 'overdue_time', '过期时间' ],
      [ 'renew_price', '续费价格' ],
      [ 'username', '用户' ],
      [ 'month_sum_flow_threshold', '当月流量阈' ],
      [ 'month_overlap_flow', '叠加流量' ],
      [ 'month_shengyu_flow', '剩余流量' ],
    ];
    const attrsOfB = [
      [ 'shengyu_money', '余额' ],
      [ 'month_voice_duration_threshold', '当月语音时长阈' ],
      [ 'month_shengyu_voice_duration', '当月剩余语音时长' ],
      [ 'voice_serv_status', '语音服务关停状态' ],
    ];

    let attributes = [].concat(commonAttrs);
    if (simTypeIsB) {
      attributes = attributes.concat(attrsOfB);
    }
    whereCondition.attributes = attributes;
    const simData = await this.app.model.Sim.findAll(whereCondition);
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

  // 获取表中存在的simId
  async getRepeatSimIds(ids) {
    const { Sim } = this.app.model;
    const Op = this.getOp();
    const result = await Sim.findAll({
      where: {
        simId: {
          [Op.in]: ids,
        },
      },
      attributes: [ 'simId' ],
    });
    return result;
  }
}

module.exports = SimService;
