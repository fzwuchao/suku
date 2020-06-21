'use strict';

// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class ErrorLogService extends BaseService {


  async getErrorLogPage(pageSize, pageNum, status, name) {
    const attributes = [ 'id', 'params', 'name', 'status', 'message', 'url', 'source', 'type', 'result', 'isExec', 'createdAt' ];
    const Op = this.getOp();
    const where = { isExec: 0 };
    if (name) {
      where.name = { [Op.substring]: name };
    }
    if (status) {
      where.status = status;
    }
    const result = await this.findAndCountAll('ErrorLog', pageSize, pageNum, {
      attributes,
      where,
      include: {
        model: this.app.model.OnelinkPlatform,
      },
    });
    return result;
  }

  async update(errorLog) {
    try {
      await this.app.model.ErrorLog.update(errorLog, { where: { id: errorLog.id } });
    } catch (e) {
      return false;
    }
    return true;
  }
  async bulkUpdate(ids, value, oper) {
    try {
      const values = {};
      values[oper] = value;
      await this.app.model.ErrorLog.update(values, { where: { id: { [this.getOp().in]: ids } } });
    } catch (e) {
      return false;
    }
    return true;
  }


}

module.exports = ErrorLogService;
