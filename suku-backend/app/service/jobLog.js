/* eslint-disable no-use-before-define */
'use strict';

// const path = require('path');
const moment = require('moment');
const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';
const { SIM_CARD_STATUS,OPER_TYPE_BATCH,SERVICE_TYPE,SERV_OP_BATCH, SERV_STATUS, SIM_FLOW_SERV_STATUS,SIM_VOICE_SERV_STATUS} = require('../extend/constant')();
const calc = require('calculatorjs');
class JobLogService extends BaseService {


  async getJobLogPage(pageSize, pageNum, status, name) {
    const attributes = [ 'id', 'params', 'name', 'jobStatus', 'url', 'jobId', 'errorSim', 'result', 'isExec', 'createdAt' ];
    const Op = this.getOp();
    const where = { isExec: 0 };
    if (name) {
      where.name = { [Op.substring]: name };
    }
    if (status) {
      where.status = status;
    }
    const result = await this.findAndCountAll('JobLog', pageSize, pageNum, {
      attributes,
      where,
      include: {
        model: this.app.model.OnelinkPlatform,
        as: 'onelink',
      },
    });
    // await this.ctx.service.schedule.monthCalculate();
    // await this.ctx.service.schedule.syncUpdateBatch();
    return result;
  }

  async dealUnfinishedJobs(jobLog, done) {
    const { ctx } = this;
    const { service, logger } = ctx;
    logger.info(`【开始执行队列：】:${jobLog.name} ms`);
    const { params, name, onelinkId, jobId, url } = jobLog;
    const api = {
      name,
      url,
    };
    const res = await service.chinaMobile.querySimBatchResult(jobId, params.msisdns, params, api, onelinkId);
    
    if (res.sucessIds) {
      const data = {};
      if (params.serviceType = SERVICE_TYPE.FLOW) {
        data.flowServStatus = params.operType;
      }
      if (params.serviceType = SERVICE_TYPE.VOICE) {
        data.voiceServStatus = params.operType;
      }
      if(!params.serviceType){
        switch(params.operType) {
          case OPER_TYPE_BATCH.ACTIVE_STOP:
            data.cardStatus = SIM_CARD_STATUS.STOP;
            break;
          case OPER_TYPE_BATCH.STOP_ACTIVE:
            data.cardStatus = SIM_CARD_STATUS.ACTIVE;
            break;
        }
        
      }
      await service.sim.batchUpdateBySimIds(data, res.sucessIds);
    }
    done();
    // return true;
  }

  async openFlowServ(data, done) {
    const { service, logger } = this.ctx;
    await service.chinaMobile.operateSimApnFunction('0', data.simId);
    const sim = await service.sim.getSimBySimId(data.simId);
    this.app.queue.create('syncUpdateAfterPay', sim).priority('high').ttl(1000*60*2).delay(10000*6*2) // 延时多少毫秒
        .removeOnComplete( true ).save();
    done();
  }

  async syncUpdateAfterPay(data, done){
    await service.sim.syncUpdate(data, false, false, '[service->jobLog->openFlowServ]');
    done();
  }

  async MigratBatchSyncUpdate(data, done) {
    const results = data.sims;
    const ctx = this.ctx;
    let isDone = false;
    const { service, logger } = ctx;
    logger.warn('【同步更开始1000条】');
    const promises = results.map(result => {
      return service.sim.syncUpdate(result, data.isMigrat, true);
    });
    // const promises = [];
    // for(let i=0;i<4;i++){
    //   promises.push(service.sim.syncUpdate(results[i], data.isMigrat, true));
    // }
    const datas = await Promise.all(promises);
    // logger.info(datas)
    await service.sim.bulkUpdate(datas);
    logger.warn('【同步更新完成1000条】');
    done();
    
  }


  async iccidSyncUpdate(data, done) {
    const results = data.sims;
    const ctx = this.ctx;
    let isDone = false;
    const { service, logger } = ctx;
    logger.warn('【同步更开始1000条】');
    const promises = results.map(result => {
      return service.sim.iccidUpdate(result);
    });
    const datas = await Promise.all(promises);
    await service.sim.bulkUpdateIccid(datas);
    logger.warn('【同步更新完成1000条】');
    done();
    
  }

  async configLimtValue(data, done) {
    const results = data.sims;
    const ctx = this.ctx;
    const { service, logger } = ctx;
    logger.warn('【设置阀值1000条】');
    const promises = results.map(result => {
      return service.sim.configLimtValueBySim(result);
    });
    Promise.all(promises).then(()=>{
      logger.warn('【设置阀值完成1000条】');
      done();
    });
  }

  async BatchSyncUpdate(data, done) {
    const results = data.sims;
    const ctx = this.ctx;
    const { service, logger,helper } = ctx;
    const Op = this.getOp();
    logger.warn('【同步更开始100条】');
    const promises = results.map(result => {
      // service.sim.configLimtValueBySim(result);
      return service.sim.syncUpdate(result, data.isMigrat, true);
    });
    const datas = await Promise.all(promises);
    await service.sim.bulkUpdate(datas);
    // let overdueIds=[];
    let flowIds = [];
    let voiceIds = [];
    for (let i = 0; i < datas.length; i++) { // result.length
      const item = datas[i];
      if((item.virtualMult * item.monthUsedFlow) > ((item.monthOverlapFlow-0)+(item.monthFlow-0)) || (!item.overdueTime && moment(new Date()).diff(moment(item.overdueTime), 'years', true) >= 0)) {
        if(item.flowServStatus ===  SERV_STATUS.ON)
        {
          flowIds.push(item.simId);
        }
        
      }
      if((item.monthUsedVoiceDuration) > ((item.monthOverlapVoiceDuration-0)+(item.monthVoice-0))  || (!item.overdueTime && moment(new Date()).diff(moment(item.overdueTime), 'years', true) >= 0)) {
        if(item.voiceServStatus ===  SERV_STATUS.ON)
        {
          voiceIds.push(item.simId)
        }
      }
    }

    // 关掉超流的卡
    const flowSpIds = helper.splitArray(flowIds, 100);
    for(let i=0; i < flowSpIds.length; i++) {
      const simIds = flowSpIds[i];
      const result = await service.chinaMobile.operateSimCommunicationFuctionBatch(
        simIds.join('_'),
        SERVICE_TYPE.FLOW,
        SERV_OP_BATCH.OFF,
        'CMIOT'
      );
      
      if (result.sucessIds) {
        await service.sim.batchUpdateBySimIds({flowServStatus: SIM_FLOW_SERV_STATUS.OFF}, result.sucessIds);
      }
    }
    // 关掉潮流测语音
    const voiceSpIds = helper.splitArray(voiceIds, 100);

    for(let i=0; i<voiceSpIds.length; i++) {
      const simIds = voiceSpIds[i];
      const result = await service.chinaMobile.operateSimCommunicationFuctionBatch(
        simIds.join('_'),
        SERVICE_TYPE.VOICE,
        SERV_OP_BATCH.OFF,
        'CMIOT'
      );
      if (result.sucessIds) {
        await service.sim.batchUpdateBySimIds({voiceServStatus:SIM_VOICE_SERV_STATUS.OFF }, result.sucessIds);
      }
    }
    
    
    logger.warn('【同步更完成100条】');
    // const calledQuery = {
    //   overdueTime: { [Op.gt]: new Date() },
    //   cardStatus: SIM_CARD_STATUS.STOP
    // };
    // await service.sim.updateCardStatusBatch(SIM_CARD_STATUS.ACTIVE, calledQuery);
    // // 超流量的卡进行停流量，超语音的卡进行停语音处理
    // await service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.OFF, '(month_used_flow*virtual_mult) >= (month_overlap_flow+month_flow)');
    // await service.sim.updateVoiceServStatusBatch(SIM_VOICE_SERV_STATUS.OFF, '(month_used_voice_duration) >= (month_overlap_voice_duration+month_voice)');
    
  }


  async create(jobLog) {
    try {
      await this.app.model.JobLog.create(jobLog);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(jobLog) {
    try {
      await this.app.model.JobLog.update(jobLog, { where: { id: jobLog.id } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async bulkUpdate(ids, value, oper) {
    try {
      const values = {};
      values[oper] = value;
      await this.app.model.JobLog.update(values, { where: { id: { [this.getOp().in]: ids } } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async deleteBatch() {
    try {
      await this.app.model.JobLog.destroy({ where: { isExec: 1 } });
    } catch (e) {
      return false;
    }
    return true;
  }

}

module.exports = JobLogService;
