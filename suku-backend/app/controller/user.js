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
  async getUserlist() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.pageRules;

    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const { pageNum, pageSize } = request.query;
    const user = this.getCurUser();
    const result = await ctx.service.user.getUsersPage(user.id, pageSize, pageNum);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { id } = request.body;
    let rule = null;
    if (id && id !== null) {
      rule = helper.rules.user([ 'username', 'name' ]);
    } else {
      rule = helper.rules.user([ 'username', 'name', 'password' ]);
    }
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.body);

    const curUser = this.getCurUser();
    const user = request.body;
    user.pid = curUser.id;
    user.pname = curUser.name;
    if (id && id !== null) {
      const result = await ctx.service.user.update(user);
      this.success(result, '');
    } else {
      const result = await ctx.service.user.create(user);
      this.success(result, '');
    }
  }

  async getUserByUsername() {
    const { ctx } = this;
    const { request } = ctx;
    const { username } = request.query;
    const result = await ctx.service.user.getUserByUsername(username);
    if (result) {
      this.success({ exit: true }, '用户名已经存在');
    } else {
      this.success({ exit: false }, '用户名可用');
    }
  }
  async getUserById() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.user([ 'id' ]);
    ctx.validate(rule, request.query);
    const { id } = request.query;
    const result = await ctx.service.user.getUserById(id);
    this.success(result, '成功');

  }
}
module.exports = UserController;
