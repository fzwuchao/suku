'use strict';

const BaseController = require('../core/baseController');

class MessageSendController extends BaseController {

  async getSimOrderlist() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { pageRules, simOrder } = helper.rules;

    const rule = {
      ...simOrder([ 'orderType' ]),
      ...pageRules,
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const result = await ctx.service.simOrder.getSimOrderPage(request.query);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper } = ctx;
    let rule = null;
    rule = helper.rules.simOrder([ 'simId', 'cname', 'cid', 'dealAmount', 'orderType' ]);
    ctx.validate(rule, request.body);
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    const { simId } = request.body;
    const sim = await ctx.service.sim.getSimBySimId(simId);
    const order = request.body;
    // 缺少调用移动端发送短信的接口，在此位置调用
    order.uname = sim.uname;
    order.uid = sim.uid;
    await ctx.service.simOrder.create(order);
    await ctx.service.chinaMobile.changeSimStatus(simId, 6);// 6: 待激活转已激活
    await ctx.service.chinaMobile.operateSimCommunicationFuctionBatch(simId, '11', '1', 'CMIOT'); // 开启数据服务
    await ctx.service.simOrder.changeSim(sim, order);
    this.success(true, '');
  }

}
module.exports = MessageSendController;
