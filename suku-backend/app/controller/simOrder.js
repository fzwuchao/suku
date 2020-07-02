'use strict';

const BaseController = require('../core/baseController');
const { payApi } = require('../extend/wechat')();
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
    order.uname = sim.uname;
    order.uid = sim.uid;
    const newOrdere = await ctx.service.simOrder.create(order);
    const result = await payApi.getPayParams({
      out_trade_no: newOrdere.orderId,
      body: 'sim pay',
      total_fee: newOrdere.dealAmount * 100,
      openid: order.openid,
    });
    this.success(result, '');
  }
}
module.exports = MessageSendController;
