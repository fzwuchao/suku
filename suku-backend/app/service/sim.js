/* eslint-disable dot-notation */
'use strict';

/**
 */
const BaseService = require('../core/baseService');
const moment = require('moment');
const { SIM_CARD_STATUS, SIM_FLOW_SERV_STATUS, SIM_VOICE_SERV_STATUS, OPER_TYPE_BATCH, SERV_OP_BATCH, SERVICE_TYPE } = require('../extend/constant')();
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
  async getSimPageData({ simId, simIdRange, username, cardStatus, isActive, simType, activeMenuName, pageSize, pageNum }) {
    const result = this.getWhereCondition({ simId, simIdRange, username, cardStatus, isActive, simType, activeMenuName });
    const simData = await this.findAndCountAll('Sim', pageSize, pageNum, result.whereCondition, result.queryKey);
    // await this.updateCardStatusBatch('2');

    return simData;
  }

  getWhereCondition({ simId, simIdRange, uname, cardStatus, isActive, simType, activeComboName }) {
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

    if (cardStatus !== undefined) {
      condition['cardStatus'] = {
        [Op.eq]: cardStatus,
      };
      queryKey['cardStatus'] = cardStatus;
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
    // await this.app.redis.del('Sim:{"simType":"B"}:10:1');
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

  /**
   * @param {array} simIds - 卡号
   * @return {object} - { [simId]: { uid, uname }}
   */
  async getSimIdToUserMapBySimIds(simIds) {
    const { Sim } = this.app.model;
    const Op = this.getOp();
    const result = await Sim.findAll({
      where: {
        simId: {
          [Op.in]: simIds,
        },
      },
      attributes: [ 'simId', 'uid', 'uname' ],
    });

    const simIdToUserMap = {};
    result.forEach(sim => {
      simIdToUserMap[sim.simId] = { uid: sim.uid, uname: sim.uname };
    });
    return simIdToUserMap;
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
  /**
   * 批量设置卡的状态
   * @param {*} cardStatus 需要设置卡的状态
   * @param {*} query  获取ids的其他查询条件
   */
  async updateCardStatusBatch(cardStatus, query) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    if (!query) {
      query = {};
    }
    data.cardStatus = cardStatus;
    const operType = cardStatus === SIM_CARD_STATUS.ACTIVE ? OPER_TYPE_BATCH.STOP_ACTIVE : OPER_TYPE_BATCH.ACTIVE_STOP;
    query.cardStatus = cardStatus === SIM_CARD_STATUS.ACTIVE ? SIM_CARD_STATUS.STOP : SIM_CARD_STATUS.ACTIVE;
    const { oneLinkSimIds } = await this.getOnelinkSimIds(query);
    for (const key in oneLinkSimIds) {
      const simIds = oneLinkSimIds[key];
      for (let i = 0; i < simIds.length; i++) {
        const result = await service.chinaMobile.changeSimStatusBatch(simIds[i], operType);
        if (result.sucessIds) {
          await this.batchUpdateBySimIds(data, result.sucessIds);
        }
      }
    }
    return true;
  }
  /**
   * 批量设置流量服务
   * @param {*} flowServStatus  需要设置的流量服务状态
   * @param {*} query  获取ids的其他查询条件
   */
  async updateFlowServStatusBatch(flowServStatus, query) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    if (!query) {
      query = {};
    }
    data.flowServStatus = flowServStatus;
    const operType = flowServStatus === SIM_FLOW_SERV_STATUS.OFF ? SERV_OP_BATCH.OFF : SERV_OP_BATCH.ON;
    query.flowServStatus = flowServStatus === SIM_FLOW_SERV_STATUS.OFF ? SIM_FLOW_SERV_STATUS.ON : SIM_FLOW_SERV_STATUS.OFF;
    const { oneLinkSimIds } = await this.getOnelinkSimIds(query);
    for (const key in oneLinkSimIds) {
      const simIds = oneLinkSimIds[key];
      for (let i = 0; i < simIds.length; i++) {
        const result = await service.chinaMobile.operateSimCommunicationFuctionBatch(
          simIds[i],
          SERVICE_TYPE.FLOW,
          operType,
          'CMIOT'
        );
        if (result.sucessIds) {
          await this.batchUpdateBySimIds(data, result.sucessIds);
        }
      }
    }

    return true;
  }
  /**
 * 批量修改语音状态
 * @param {*} voiceServStatus
 * @param {*} query  获取ids的其他查询条件
 */
  async updateVoiceServStatusBatch(voiceServStatus, query) {
    const ctx = this.ctx;
    const { service } = ctx;
    const data = {};
    if (!query) {
      query = {};
    }
    data.voiceServStatus = voiceServStatus;
    const operType = voiceServStatus === SIM_VOICE_SERV_STATUS.OFF ? SERV_OP_BATCH.OFF : SERV_OP_BATCH.ON;
    query.voiceServStatus = voiceServStatus === SIM_VOICE_SERV_STATUS.OFF ? SIM_VOICE_SERV_STATUS.ON : SIM_VOICE_SERV_STATUS.OFF;
    const { oneLinkSimIds } = await this.getOnelinkSimIds(query);
    for (const key in oneLinkSimIds) {
      const simIds = oneLinkSimIds[key];
      for (let i = 0; i < simIds.length; i++) {
        const result = await service.chinaMobile.operateSimCommunicationFuctionBatch(
          simIds[i],
          SERVICE_TYPE.VOICE,
          operType,
          'CMIOT'
        );
        if (result.sucessIds) {
          await this.batchUpdateBySimIds(data, result.sucessIds);
        }
      }
    }

    return true;
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
  async getOnelinkSimIds(where) {
    const ctx = this.ctx;
    const { service } = ctx;
    const onelinks = await service.onelinkPlatform.getAllOnelinkDesc();
    const oneLinkSimIds = {};
    const simIds = [];
    for (let i = 0; i < onelinks.length; i++) {
      where.onelinkId = onelinks[i].id;
      const result = await this.app.model.Sim.findAll({
        attributes: [ 'simId' ],
        where,
      });
      // const result1 = await this.findAndCountAll('Sim', 3, 4, { attributes: [ 'simId' ], where });
      // const result = result1.list;
      const simStrList = [];
      // const simArrayList = [];
      let osimIds = [];

      for (let j = 0; j < result.length; j++) { // result.length
        osimIds.push(result[j].simId);
        simIds.push(result[j].simId);
        if ((j + 1) % 2 === 0) {
          simStrList.push(osimIds.join('_'));
          // simArrayList.push()
          osimIds = [];
        }
        if ((result.length % 2) !== 0 && j === (result.length - 1)) {
          simStrList.push(osimIds.join('_'));
        }

      }
      oneLinkSimIds[onelinks[i].id] = simStrList;
    }
    return { oneLinkSimIds, simIds };
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
  /**
   * 单卡短信功能开通
   */
  async updateMsgServStatus(simId, msgServStatus) {
    const ctx = this.ctx;
    const { service } = ctx;
    const operType = msgServStatus;
    const res = await service.chinaMobile.operateSimSmsFunction(operType, simId);
    /* if (!res.error) {
      await this.batchUpdateBySimIds(data, [ simId ]);
    } */
    return res;
  }


}

module.exports = SimService;
