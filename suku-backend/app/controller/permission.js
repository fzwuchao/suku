'use strict';

const BaseController = require('../core/base_controller');

class PermissionController extends BaseController {
  // 获取验证码
  async getPermission() {
    const { ctx } = this;
    const { service } = ctx;
    const permissions = await service.permission.getPermission(1);
    this.success(permissions, '');
  }

}

module.exports = PermissionController;
