'use strict';

// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class ErrorLogService extends BaseService {


  async getErrorLogPage(pageSize, pageNum) {
    const attributes = [ 'id', 'params', 'status', 'message', 'url', 'source', 'type', 'jobId', 'createdAt' ];
    // const Op = this.getOp();
    const result = await this.findAndCountAll('ErrorLog', pageSize, pageNum, {
      attributes,
      // where: { id: { [Op.in]: ids } },
    });
    return result;
  }

  async create(errorLog) {
    try {
      await this.app.model.ErrorLog.create(errorLog);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(errorLog) {
    try {
      await this.app.model.ErrorLog.update(errorLog, { where: { id: errorLog.id } });
    } catch (e) {
      return false;
    }
    return true;
  }


}

module.exports = ErrorLogService;
