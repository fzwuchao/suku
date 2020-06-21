'use strict';

/**
 * 角色权限关联
 */
const BaseService = require('../core/baseService');

class RolePermissionMapService extends BaseService {

  async createRolePermMap(list, options) {
    return await this.ctx.model.RolePermissionMap.bulkCreate(list, { ...options });
  }

  async deleteByRoleId(options) {
    return await this.ctx.model.RolePermissionMap.destroy(options);
  }
}

module.exports = RolePermissionMapService;
