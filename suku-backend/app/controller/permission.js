'use strict';

const BaseController = require('../core/baseController');

class PermissionController extends BaseController {
  // 获取验证码
  async getPermission() {
    const { ctx } = this;
    const { service } = ctx;
    const user = ctx.helper.loginUser.parse(ctx.cookies.get('loginUserInfo')) || {};
    const permissions = await service.permission.getPermission(user.roleId);
    this.success(permissions, '');
  }

}

module.exports = PermissionController;
