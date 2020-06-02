'use strict';

const BaseController = require('../core/base_controller');

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
    const result = await ctx.service.user.getUsersPage(user.id, pageSize, pageNum);
    this.success(result, '');
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
}
module.exports = UserController;
