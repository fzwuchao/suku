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
    const result = await ctx.service.simOrder.getSimOrderlist(request.query);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper } = ctx;
    let rule = null;
    rule = helper.rules.messageSend([ 'simId', 'content' ]);
    ctx.validate(rule, request.body);
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    const { simId, content } = request.body;
    const sender = ctx.service.sim.getSimBySimId(simId);
    const messageSend = { simId, content };
    // 缺少调用移动端发送短信的接口，在此位置调用
    messageSend.sender = sender.name;
    messageSend.senderId = sender.id;
    const result = await ctx.service.messageSend.create(messageSend);
    this.success(result, '');
  }

}
module.exports = MessageSendController;
