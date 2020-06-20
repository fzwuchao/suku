'use strict';

// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class JobLogService extends BaseService {


  async getErrorLogPage(pageSize, pageNum) {
    const attributes = [ 'id', 'params', 'status', 'message', 'url', 'source', 'type', 'jobId', 'createdAt' ];
    // const Op = this.getOp();
    const result = await this.findAndCountAll('JobLog', pageSize, pageNum, {
      attributes,
      // where: { id: { [Op.in]: ids } },
    });
    return result;
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


}

module.exports = JobLogService;
