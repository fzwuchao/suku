/* eslint-disable no-use-before-define */
'use strict';

// const path = require('path');

const BaseService = require('../core/baseService');
const moment = require('moment');

const {
  SIM_CARD_STATUS,
  SIM_FLOW_SERV_STATUS,
  SIM_VOICE_SERV_STATUS,
  SIM_TYPE,
} = require('../extend/constant')();

class ScheduleService extends BaseService {

  /**
   * 每月1号月结
   */
  async monthCalculate() {

    const OP = this.getOp();
    const { ctx } = this;
    const { service, logger } = ctx;
    logger.info('********************月结处理*********************');
    const startTime = moment().milliseconds();
    // 修改余额，已用流量，已用语音清零，叠加流量清零
    let updateSql = 'update sim set';
    updateSql += ' shengyu_money = shengyu_money - month_rent,'; // 余额减去月租
    updateSql += ' month_used_flow =0,'; // 已用流量清零
    updateSql += ' month_used_voice_duration=0,'; // 已用语音清零
    updateSql += ' month_overlap_voice_duration=0,'; // 叠加语音清零
    updateSql += ' month_overlap_flow=0'; // 叠加流量清零
    updateSql += ' where shengyu_money > 0';
    updateSql += '  and is_active = 1';
    await this.app.model.query(updateSql);

    // 已过期的被叫卡进行停机处理
    const calledQuery = {
      overdueTime: { [OP.lt]: new Date() },
      cardStatus: SIM_CARD_STATUS.ACTIVE,
      simType: SIM_TYPE.CALLED,
    };
    await service.sim.updateCardStatusBatch(SIM_CARD_STATUS.STOP, calledQuery);
    // 已过期的主叫卡进行停流量停语音的处理
    const callQuery = {
      overdueTime: { [OP.lt]: new Date() },
      cardStatus: SIM_CARD_STATUS.ACTIVE,
      simType: SIM_TYPE.CALL,
    };
    await service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.OFF, callQuery);
    await service.sim.updateVoiceServStatusBatch(SIM_VOICE_SERV_STATUS.OFF, callQuery);
    // 上月超流量，超语音的卡服务打开处理
    const servQuery = {
      overdueTime: { [OP.gt]: new Date() },
      cardStatus: SIM_CARD_STATUS.ACTIVE,
    };
    await service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.ON, servQuery);
    const voiceServQuery = {
      overdueTime: { [OP.gt]: new Date() },
      cardStatus: SIM_CARD_STATUS.ACTIVE,
      simType: SIM_TYPE.CALL,
    };
    await service.sim.updateVoiceServStatusBatch(SIM_VOICE_SERV_STATUS.ON, voiceServQuery);
    const endTime = moment().milliseconds();
    logger.info(`【月结操作，总响应时间：】:${endTime - startTime} ms`);
  }

  /**
 * 批量同步更新卡状态
 */
  async syncUpdateBatch() {
    const { service, logger } = this.ctx;
    // const OP = this.getOp();
    logger.info('********************同步卡基本信息*********************');
    const startTime = moment().milliseconds();
    const result = await service.sim.getActivedSim();
    for (let i = 0; i < result.length; i++) {
      const { simId, simType, activeComboId } = result[i];
      await service.sim.syncUpdate(simId, simType, activeComboId);
    }
    // result.map(sim => {
    //   const { simId, simType } = sim;
    //   return await service.sim.syncUpdate(simId, simType);
    // });
    // await Promise.all(promises);
    // 超流量的卡进行停流量，超语音的卡进行停语音处理
    await service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.OFF, '(month_used_flow*virtual_mult) >= (month_overlap_flow+month_flow)');
    await service.sim.updateVoiceServStatusBatch(SIM_VOICE_SERV_STATUS.OFF, '(month_used_voice_duration) >= (month_overlap_voice_duration+month_voice)');
    const endTime = moment().milliseconds();
    logger.info(`【总同步更新，接口总响应时间：】:${endTime - startTime} ms`);
  }
  /**
 * 删除已经处理过的日志
 */
  async deleteLogs() {
    const { service, logger } = this.ctx;
    logger.info('********************定期删除已处理过的日志*********************');
    const startTime = moment().milliseconds();
    await service.errorLog.deleteBatch();
    await service.jobLog.deleteBatch();
    const endTime = moment().milliseconds();
    logger.info(`【删除处理过的日志，总响应时间：】:${endTime - startTime} ms`);
  }

}

module.exports = ScheduleService;
