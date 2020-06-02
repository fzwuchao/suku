'use strict';

// const uuid = require('uuid');
// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class RoleService extends BaseService {
  async getRoleInfo(id) {
    const [ role ] = await this.app.model.Role.findAll({
      where: {
        id,
      },
    });

    return role;
  }

  async getRolesPage(level, pageSize, pageNum) {

    const result = await this.findAndCountAll('Role', pageSize, pageNum, { level: {
      [this.getOp().gt]: level,
    } });
    return result;
  }

}

module.exports = RoleService;
