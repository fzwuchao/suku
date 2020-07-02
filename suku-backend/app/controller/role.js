'use strict';

const BaseController = require('../core/baseController');

class UserController extends BaseController {
  /* async exportFile() {
    const ctx = this.ctx;
    const filepath = await ctx.service.user.exportData();
    this.ctx.attachment(filepath);
    this.ctx.set('Content-Type', 'application/octet-stream');
    this.ctx.body = ctx.service.sheet.createReadStream(filepath);
    // 删除不了，mysql用户创建的文件，其它用户没有权限
    // ctx.service.sheet.removeFile(filepath);
  } */
  async getRolelist() {
    const { ctx } = this;
    const { request } = ctx;
    const rule = {
      pageNum: {
        type: 'int',
      },
      pageSize: {
        type: 'int',
      },
    };

    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const { pageNum, pageSize } = request.query;
    const user = this.getCurUser();
    const role = await ctx.service.role.getRoleInfo(user.roleId);
    const result = await ctx.service.role.getRolesPage(role.level, pageSize, pageNum);
    this.success(result, '');
  }

  async getAllRoles() {
    const { ctx } = this;
    const user = this.getCurUser();
    const role = await ctx.service.role.getRoleInfo(user.roleId);
    const result = await ctx.service.role.getRoles(role.level);
    this.success(result, '');
  }

  async delete() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { role } = helper.rules;
    const rule = {
      ...role([ 'id' ]),
    };
    ctx.validate(rule, request.body);
    const { id } = request.body;
    const result = await service.role.delByRoleId(id);
    if (result) {
      this.success(null, '删除成功');
    } else {
      this.fail(null, null, '删除失败');
    }
  }
  getRoleType() {
    this.success(this.ctx.helper.ROLE_TYPE, null);
  }
}
module.exports = UserController;
