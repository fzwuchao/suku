/* eslint-disable no-use-before-define */
'use strict';

// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';
const { LIMT_OPTY, SIM_FLOW_SERV_STATUS,SIM_VOICE_SERV_STATUS} = require('../extend/constant')();
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
      if (params.cardStatus) {
        data.cardStatus = params.cardStatus === '2' ? '4' : '2';
      }
      await service.sim.batchUpdateBySimIds(data, res.sucessIds);
    }
    done();
    // return true;
  }

  async openFlowServ(data, done) {
    const { service, logger } = this.ctx;
    logger.info(`【开始执行队列：】:${data.simId} ms`);
    await service.chinaMobile.operateSimApnFunction('0', data.simId);
    const sim = service.sim.getSimBySimId(data.simId);
    await service.sim.syncUpdate(sim);
    done();
  }

  async MigratBatchSyncUpdate(data, done) {
    const results = data.sims;
    const ctx = this.ctx;
    const { service, logger } = ctx;
    logger.info('【同步更开始500条】');
    const promises = results.map(result => {
      const operType = LIMT_OPTY.ADD;
      const limtValue = calc(`${result.monthFlow}/${result.virtualMult}`).toFixed(3);
      service.chinaMobile.configLimtValue(operType, limtValue, result.simId);
      return service.sim.syncUpdate(result, data.isMigrat);
    });
    await Promise.all(promises);
    logger.info('【同步更新完成500条】');
    done();
  }

  async BatchSyncUpdate(data, done) {
    const results = data.sims;
    const ctx = this.ctx;
    const { service, logger } = ctx;
    logger.info('【同步更开始500条】');

    const promises = results.map(result => {
      const operType = LIMT_OPTY.ADD;
      const limtValue = calc(`${result.monthFlow}/${result.virtualMult}`).toFixed(3);
      service.chinaMobile.configLimtValue(operType, limtValue, result.simId);
      return service.sim.syncUpdate(result, data.isMigrat);
    });
    await Promise.all(promises);
    // 超流量的卡进行停流量，超语音的卡进行停语音处理
    await service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.OFF, '(month_used_flow*virtual_mult) >= (month_overlap_flow+month_flow)');
    await service.sim.updateVoiceServStatusBatch(SIM_VOICE_SERV_STATUS.OFF, '(month_used_voice_duration) >= (month_overlap_voice_duration+month_voice)');
    logger.info('【同步更新完成500条】');
    done();
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
