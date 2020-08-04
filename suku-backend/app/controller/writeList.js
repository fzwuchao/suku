'use strict';

const BaseController = require('../core/baseController');
const {WRITELIST_STATUS} = require('../extend/constant')();
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
    let writeList = await ctx.service.writeList.getWriteListBySimdIdAndPhone(simId, phone);
    if(writeList && writeList.status == WRITELIST_STATUS.DEALING){
      this.fail('99', writeList, '亲情号正在处理中, 请勿重复添加！请3分钟后再操作');
      return ;
    } else if(writeList && writeList.status == WRITELIST_STATUS.SUCCESS){
      this.fail('99', writeList, '亲情号已经存在, 请勿重复添加！请3分钟后再操作');
      return ;
    }
    if(!writeList) {
      writeList = { simId, phone };
      const sim = await ctx.service.sim.getSimBySimId(simId);
      // 缺少调用移动端发送短信的接口，在此位置调用
      writeList.uname = sim.uname;
      writeList.uid = sim.uid;
      writeList.onelinkId = sim.onelinkId;
      writeList.onelinkName = sim.onelinkName;
      writeList.status = WRITELIST_STATUS.DEALING;
      await ctx.service.writeList.create(writeList);
    }
    const res = await ctx.service.chinaMobile.configMemberVoiceWhitelist(1, phone, simId);
    this.success(res, '亲情号处理中，请耐心等待，20分钟可查询状态');
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
