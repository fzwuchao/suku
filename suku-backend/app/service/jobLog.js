/* eslint-disable no-use-before-define */
'use strict';

// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

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
      },
    });
    return result;
  }

  async dealUnfinishedJobs(jobLog) {
    const { ctx } = this;
    const { service } = ctx;
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
    return true;
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
