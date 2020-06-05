'use strict';

const BaseController = require('../core/baseController');

class OnelinkPlatformController extends BaseController {
  /* async exportFile() {
    const ctx = this.ctx;
    const filepath = await ctx.service.user.exportData();
    this.ctx.attachment(filepath);
    this.ctx.set('Content-Type', 'application/octet-stream');
    this.ctx.body = ctx.service.sheet.createReadStream(filepath);
    // 删除不了，mysql用户创建的文件，其它用户没有权限
    // ctx.service.sheet.removeFile(filepath);
  } */
  async getOnelinklist() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.pageRules;

    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const { pageNum, pageSize } = request.query;
    const result = await ctx.service.onelinkPlatform.getOnelinkPage(pageSize, pageNum);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { id } = request.body;
    let rule = null;
    if (id && id !== null) {
      rule = helper.rules.onelink([ 'name', 'appId', 'apiHost', 'apiVersion', 'secretKey' ]);
    } else {
      rule = helper.rules.onelink([ 'name', 'appId', 'apiHost', 'apiVersion', 'secretKey', 'nameKey' ]);
    }
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.body);

    const onelink = request.body;
    if (id && id !== null) {
      const result = await ctx.service.onelinkPlatform.update(onelink);
      this.success(result, '');
    } else {
      const result = await ctx.service.onelinkPlatform.create(onelink);
      this.success(result, '');
    }
  }

  async updateStatus() {
    const { ctx } = this;
    const { request } = ctx;
    const rule = {
      ids: {
        type: 'array',
        itemType: 'int',
      },
      status: {
        type: 'int',
      },
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.body);
    const { ids, status } = request.body;
    const result = await ctx.service.onelinkPlatform.bulkUpdate(ids, status, 'status');
    this.success(result, '');
  }

  async getOnelinkByNameKey() {
    const { ctx } = this;
    const { request } = ctx;
    const { nameKey } = request.query;
    const result = await ctx.service.onelinkPlatform.getOnelinkByNameKey(nameKey);
    if (result) {
      this.success({ exit: true }, 'name Key 已经存在');
    } else {
      this.success({ exit: false }, 'name Key 可用');
    }
  }

  async getOnelinkById() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.onelink([ 'id' ]);
    ctx.validate(rule, request.query);
    const { id } = request.query;
    const result = await ctx.service.onelinkPlatform.getOnelinkById(id);
    this.success(result, '成功');

  }
}
module.exports = OnelinkPlatformController;
