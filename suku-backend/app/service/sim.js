/* eslint-disable dot-notation */
'use strict';

/**
 */
const BaseService = require('../core/baseService');
const moment = require('moment');
class SimService extends BaseService {
  async update(sim) {
    try {
      await this.app.model.Sim.update(sim, { where: { id: sim.id } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async updateBySimId(sim, simId) {
    try {
      await this.app.model.Sim.update(sim, { where: { simId } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async batchUpdateBySimIds(data, simIds) {
    const Op = this.getOp();
    try {
      await this.app.model.Sim.update(data, { where: {
        simId: {
          [Op.in]: simIds,
        },
      } });
    } catch (e) {
      return false;
    }
    return true;
  }
  async getSimBySimId(simId) {
    // const attributes = [ 'simId', 'iccid', 'simType', 'activeComboId', 'activeComboName', 'otherComboIds', 'activeTime', 'overdueTime' ];
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
   *  {string} uname - 用户
   *  {int} netStatus - 状态
   *  {int} isActive - 激活状态
   *  {int} pageSize - 每页条数
   *  {int} pageNo - 页码
   * }
   * @return {{count, rows}} - 总条数，一页的数据
   */
  async getSimPageData({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName, pageSize, pageNum }) {
    const result = this.getWhereCondition({ simId, simIdRange, username, netStatus, isActive, simType, activeMenuName });
    const simData = await this.findAndCountAll('Sim', pageSize, pageNum, result.whereCondition, result.queryKey);

    return simData;
  }

  getWhereCondition({ simId, simIdRange, uname, netStatus, isActive, simType, activeComboName }) {
    const Op = this.getOp();
    const condition = {};
    const queryKey = {};

    if (simId !== undefined) {
      condition['simId'] = {
        [Op.substring]: simId,
      };
      queryKey['simId'] = simId;
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
      queryKey['simIdRange'] = simIdRange;
    }

    if (uname !== undefined) {
      condition['uname'] = {
        [Op.substring]: uname,
      };
      queryKey['uname'] = uname;
    }

    if (netStatus !== undefined) {
      condition['netStatus'] = {
        [Op.eq]: netStatus,
      };
      queryKey['netStatus'] = netStatus;
    }

    if (isActive !== undefined) {
      condition['isActive'] = {
        [Op.eq]: isActive,
      };
      queryKey['isActive'] = isActive;
    }

    if (simType !== undefined) {
      condition['simType'] = {
        [Op.eq]: simType,
      };
      queryKey['simType'] = simType;
    }

    if (activeComboName !== undefined) {
      condition['activeComboName'] = {
        [Op.substring]: activeComboName,
      };
      queryKey['activeComboName'] = activeComboName;
    }

    const whereCondition = {};

    if (Object.keys(condition).length > 0) whereCondition.where = condition;
    const result = {};
    result.whereCondition = whereCondition;
    result.queryKey = queryKey;
    return result;
  }

  async getSimDataForExcel({ simId, simIdRange, uname, netStatus, isActive, simType, activeComboName }, simTypeIsB) {
    const whereCondition = this.getWhereCondition({ simId, simIdRange, uname, netStatus, isActive, simType, activeComboName });
    const commonAttrs = [
      [ 'sim_id', 'Sim卡号' ],
      // [ 'net_status', '状态' ],
      [ 'flow_serv_status', '流量服务关停状态' ],
      [ 'active_combo_name', '激活套餐名' ],
      [ 'active_time', '激活时间' ],
      [ 'overdue_time', '过期时间' ],
      [ 'renew_price', '续费价格' ],
      [ 'uname', '用户' ],
      [ 'month_flow', '当月流量' ],
      [ 'month_overlap_flow', '叠加流量' ],
    ];
    const attrsOfB = [
      [ 'shengyu_money', '余额' ],
      [ 'month_voice', '当月语音时长' ],
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
    await this.app.redis.del('Sim:{"simType":"B"}:10:1');
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

  async syncUpdate(simId, simType) {
    const ctx = this.ctx;
    const { service, logger } = ctx;
    const startTime = moment().milliseconds();
    const params = {};
    // 被叫卡有激活时间，主叫卡有语音使用量
    const promiseList = [];
    // 激活时间
    promiseList.push(service.chinaMobile.querySimBasicInfo(simId));
    // 状态信息
    promiseList.push(service.chinaMobile.querySimStatus(simId));
    // imei
    // promiseList.push(service.chinaMobile.querySimImei(simId));
    // 开关机状态
    promiseList.push(service.chinaMobile.queryOnOffStatus(simId));
    // 通信功能开通
    promiseList.push(service.chinaMobile.querySimCommunicationFunctionStatus(simId));
    // 流量累计使用量
    promiseList.push(service.chinaMobile.querySimDataUsage(simId));
    // 语音累计使用量
    if (simType === 'B') {
      promiseList.push(service.chinaMobile.querySimVoiceUsage(simId));
    }
    const [ activeTime, cardStatus, openStatus, servStatus, monthUsedFlow, voiceAmount ] = await Promise.all(promiseList);

    if (voiceAmount) {
      params.voiceAmount = voiceAmount;
    }

    if (activeTime) {
      params.activeTime = activeTime;
      params.isActive = 1;
    }

    params.cardStatus = cardStatus;
    // params.imei = imei;
    params.openStatus = openStatus;
    for (const key in servStatus) {
      params[key] = servStatus[key];
    }
    params.monthUsedFlow = monthUsedFlow;
    const endTime = moment().milliseconds();
    logger.info(`【同步更新，接口总响应时间：】:${endTime - startTime} ms`);
    await service.sim.updateBySimId(params, simId);
  }
  async updateCardStatusBatch(oneLinkSimIds, cardStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    const allSimIds = [];
    data.cardStatus = cardStatus;
    const operType = cardStatus === '2' ? 11 : 9;
    const res = {};
    for (const key in oneLinkSimIds) {
      const simIds = oneLinkSimIds[key];
      Array.prototype.push.apply(allSimIds, simIds);
      const result = await service.chinaMobile.changeSimStatusBatch(simIds.join('_'), operType);
      if (result.error) {
        // this.fail(result.errorCode, '', result.errorInfo);
        res.code = 1001;
        res[key] = result;
        continue;
      }
      const jobId = (result[0] || {}).jobId;
      const batchResult = await service.chinaMobile.querySimBatchResult(jobId, simIds[0]);
      if (batchResult.failure) {
        // this.fail(batchResult.failCode, batchResult.failData, batchResult.failInfo);
        // return;
        res.code = 1002;
        res[key] = batchResult;
        continue;
      }
    }
    if (!res.code) {
      await this.batchUpdateBySimIds(data, allSimIds);
    }
    return res;
  }

  /**
   * 单卡状态修改
   */
  async updateCardStatus(simId, cardStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    data.cardStatus = cardStatus;
    const operType = cardStatus === '2' ? 1 : 0;
    const res = await service.chinaMobile.changeSimStatus(simId, operType);// 6: 待激活转已激活
    /* if (!res.error) {
      await this.batchUpdateBySimIds(data, [ simId ]);
    } */
    return res;
  }


  async getActivedSim() {
    const result = await this.app.model.Sim.findAll({
      where: {
        cardStatus: 2,
      },
    });
    return result;
  }

  async updateFlowServStatusBatch(oneLinkSimIds, flowServStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    const allSimIds = [];
    data.flowServStatus = flowServStatus;
    const operType = flowServStatus === '1' ? 1 : 0;
    const res = {};
    for (const key in oneLinkSimIds) {
      const simIds = oneLinkSimIds[key];
      Array.prototype.push.apply(allSimIds, simIds);
      const result = await service.chinaMobile.operateSimCommunicationFuctionBatch(simIds.join('_'), '11', operType, 'CMIOT');
      if (result.error) {
        // this.fail(result.errorCode, '', result.errorInfo);
        res.code = 1001;
        res[key] = result;
        continue;
      }
      const jobId = (result[0] || {}).jobId;
      const batchResult = await service.chinaMobile.querySimBatchResult(jobId, simIds[0]);
      if (batchResult.failure) {
        // this.fail(batchResult.failCode, batchResult.failData, batchResult.failInfo);
        // return;
        res.code = 1002;
        res[key] = batchResult;
        continue;
      }
    }
    /* if (!res.code) {
      await this.batchUpdateBySimIds(data, allSimIds);
    } */
    return res;
  }

  /**
   * 单卡数据服务开停
   */
  async updateFlowServStatus(simId, flowServStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    /*
    const data = {};
    data.flowServStatus = flowServStatus === 1 ? 2 : 1; */
    const operType = flowServStatus;
    const res = await service.chinaMobile.operateSimApnFunction(operType, simId); // 数据服务开停
    /* if (!res.error) {
      await this.batchUpdateBySimIds(data, [ simId ]);
    } */
    return res;
  }


  async updateVoiceServStatusBatch(oneLinkSimIds, voiceServStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    const allSimIds = [];
    data.voiceServStatus = voiceServStatus;
    const operType = voiceServStatus === '1' ? 1 : 0;
    const res = {};
    for (const key in oneLinkSimIds) {
      const simIds = oneLinkSimIds[key];
      Array.prototype.push.apply(allSimIds, simIds);
      const result = await service.chinaMobile.operateSimCommunicationFuctionBatch(simIds.join('_'), '01', operType, 'CMIOT');
      if (result.error) {
        // this.fail(result.errorCode, '', result.errorInfo);
        res.code = 1001;
        res[key] = result;
        continue;
      }
      const jobId = (result[0] || {}).jobId;
      const batchResult = await service.chinaMobile.querySimBatchResult(jobId, simIds[0]);
      if (batchResult.failure) {
        // this.fail(batchResult.failCode, batchResult.failData, batchResult.failInfo);
        // return;
        res.code = 1002;
        res[key] = batchResult;
        continue;
      }
    }
    if (!res.code) {
      await this.batchUpdateBySimIds(data, allSimIds);
    }
    return res;
  }

  /**
   * 单卡语音功能开通
   */
  async updateVoiceServStatus(simId, voiceServStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    const operType = voiceServStatus;
    const res = await service.chinaMobile.operateSimCallFunction(operType, simId);
    /* if (!res.error) {
      await this.batchUpdateBySimIds(data, [ simId ]);
    } */
    return res;
  }

}

module.exports = SimService;
