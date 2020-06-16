'use strict';

const BaseController = require('../core/baseController');

class WriteListController extends BaseController {

  async getWriteList() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { pageRules, writeList } = helper.rules;

    const rule = {
      ...writeList(),
      ...pageRules,
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const result = await ctx.service.writeList.getWriteListPage(request.query);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper } = ctx;
    let rule = null;
    rule = helper.rules.writeList([ 'simId', 'phone' ]);
    ctx.validate(rule, request.body);
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    const { simId, phone } = request.body;
    const sim = await ctx.service.sim.getSimBySimId(simId);
    const writeList = { simId, phone };
    // 缺少调用移动端发送短信的接口，在此位置调用
    writeList.uname = sim.uname;
    writeList.uid = sim.uid;
    const res = await ctx.service.chinaMobile.configMemberVoiceWhitelist(1, phone, simId);
    if (!res.error) {
      await ctx.service.writeList.create(writeList);
    } else {
      this.fail('99', res, '亲情号设置失败！');
    }
    this.success(res, '');
  }
  async getWriteListBySimId() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const rule = helper.rules.writeList([ 'simId' ]);
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const result = await ctx.service.writeList.getWriteListBySimId(request.query);
    this.success(result, '');
  }


}
module.exports = WriteListController;
