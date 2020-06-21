'use strict';

const BaseController = require('../core/baseController');

class PermissionController extends BaseController {
  // 获取角色的权限
  async getPermission() {
    const { ctx } = this;
    const { service } = ctx;
    const user = ctx.helper.loginUser.parse(ctx.cookies.get('loginUserInfo')) || {};
    const { permissions, checkedAndHalfKeys } = await service.permission.getPermission(user.roleId);
    this.success({ permissions, checkedAndHalfKeys }, '');
  }

  async getPermissionByRoleId() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { permission } = helper.rules;
    const rule = {
      ...permission(),
    };
    ctx.validate(rule, request.query);
    const { roleId } = request.query;
    const { permissions, checkedAndHalfKeys } = await service.permission.getPermission(roleId);
    this.success({ permissions, checkedAndHalfKeys }, '');
  }
  // 获取所有的权限树
  async getAllPermission() {
    const { ctx } = this;
    const { service } = ctx;
    const permissions = await service.permission.getAllPermission();
    this.success(permissions, '');
  }

  async save() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { permission } = helper.rules;
    const rule = {
      ...permission(),
    };
    ctx.validate(rule, request.body);
    const { id, name, displayName, permissions, level } = request.body;
    const result = await service.role.isRepeatedName(name, displayName, id);
    if (result) {
      this.fail(null, null, '角色英文名或中文名重复');
      return;
    }
    // 添加
    if (id === undefined) {
      const result = await service.permission.save({ name, displayName, level }, permissions);
      if (result) {
        this.success(null, '保存成功');
      } else {
        this.fail(null, null, '保存失败');
      }
    } else {
      // 编辑
      const result = await service.permission.update({ name, displayName, level }, id, permissions);
      if (result) {
        this.success(null, '更新成功');
      } else {
        this.fail(null, null, '更新失败');
      }
    }
    this.success(null, '');
  }
}

module.exports = PermissionController;
