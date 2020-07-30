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
    // await service.sim.configLimtValue();
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
    const OP = this.getOp();
    logger.info('********************同步卡基本信息*********************');

    const startTime = moment().milliseconds();
    const isMigrat = fasle;
    const { oneLinkSims } = await service.sim.getOnelinkSimIds({
      cardStatus: {[OP.in]:[2,4]}
    }, 200);
    for (const key in oneLinkSims) {
      const simsList = oneLinkSims[key];
      let j = 0
      for (let i = 0; i < simsList.length; i++) {
        this.app.queue.create('BatchSyncUpdate', { sims: simsList[i], isMigrat }).delay((i+j)*20000+100).ttl(1000*60*3) // 延时多少毫秒
        .save();
      }
      j++;
    }
    const endTime = moment().milliseconds();
    logger.info(`【同步卡基本信息(迁移)，接口总响应时间：】:${endTime - startTime} ms`);
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
