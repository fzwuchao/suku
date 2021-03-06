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
    const { pageNum, pageSize, name } = request.query;
    const user = this.getCurUser();
    const result = await ctx.service.user.getUsersPage(user.id, pageSize, pageNum, name);
    this.success(result, '');
  }

  async getSelectUsers() {
    const { ctx } = this;
    const user = this.getCurUser();
    let result = [];
    if (user.roleLevel <= 1) {
      result = await ctx.service.user.getAllUsers(user.id);
    } else {
      result = await ctx.service.user.getAllUsersByPid(user.id);
      result.push({ value: user.id, key: user.name });
    }

    this.success(result, '');
  }

  async getChildUsers() {
    const { ctx } = this;
    const user = this.getCurUser();
    const result = await ctx.service.user.getUserByPid(user.id);
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
    if (id && id !== null) {
      const result = await ctx.service.user.update(user);
      this.success(result, '');
    } else {
      user.pid = curUser.id;
      user.pname = curUser.name;
      const result = await ctx.service.user.create(user);
      this.success(result, '');
    }
  }

  async updatePwd() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.user([ 'id', 'password' ]);
    ctx.validate(rule, request.body);
    const user = request.body;
    const result = await ctx.service.user.update(user);
    this.success(result, '');
  }
  async updateOpenmsg() {
    const { ctx } = this;
    const { request } = ctx;
    const rule = {
      ids: {
        type: 'array',
        itemType: 'int',
      },
      openMsg: {
        type: 'int',
      },
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.body);
    const { ids, openMsg } = request.body;
    const result = await ctx.service.user.bulkUpdate(ids, openMsg, 'openMsg');
    this.success(result, '');
  }

  async updateAutoTransfer() {
    const { ctx } = this;
    const { request } = ctx;
    const rule = {
      ids: {
        type: 'array',
        itemType: 'int',
      },
      autoTransfer: {
        type: 'int',
      },
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.body);
    const { ids, autoTransfer } = request.body;
    const result = await ctx.service.user.bulkUpdate(ids, autoTransfer, 'autoTransfer');
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
  async getUserByName() {
    const { ctx } = this;
    const { request } = ctx;
    const { name } = request.query;
    const result = await ctx.service.user.getUserByName(name);
    if (result) {
      this.success({ exit: true }, '昵称已经存在');
    } else {
      this.success({ exit: false }, '昵称可用');
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
