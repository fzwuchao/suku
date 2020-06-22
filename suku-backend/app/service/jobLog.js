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

  async dealUnfinishedJobs() {
    const Op = this.getOp();
    const { ctx } = this;
    const { service } = ctx;
    const result = await this.app.model.JobLog.findAll({
      where: {
        jobStatus: {
          [Op.or]: [ '0', '1' ],
        },
        isExec: 0,
      },
    });
    for (let i = 0; i < result.length; i++) {
      const { params, name, onelinkId, jobId, url, id } = result[i];
      const api = {
        name,
        url,
      };
      const params1 = JSON.parse(params);
      const res = await service.chinaMobile.querySimBatchResult(jobId, params1.msisdns, params1, api, onelinkId);
      if (res.sucessIds) {
        // await service.sim.batchUpdateBySimIds({ cardStatus: '4' }, res.sucessIds);
      }
      this.update({ isExec: 1, id });
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

}

module.exports = JobLogService;
