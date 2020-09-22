'use strict';

const BaseController = require('../core/baseController');
const {
  SERV_STATUS,
  SIM_TYPE,
  SIM_CARD_STATUS,
  OPER_TYPE_SINGLE,
} = require('../extend/constant')();

class WechatController extends BaseController {

  async getOpenId() {
    const { ctx } = this;
    const { service, request } = ctx;
    const { code } = request.query;
    const res = await service.wechat.getOpenId(code);
    this.success(res, '');
  }
  async payBack() {
    const { ctx } = this;
    const { request, service, logger } = ctx;
    const info = request.weixin;
    logger.info('********************微信支付回调*********************')
    // const info = {
    //   return_code: 'SUCCESS',
    //   out_trade_no: 'INCRE17299873238T210108R7444',
    //   transaction_id: '4200000711202008276832310636',
    // };
    if (info.return_code === 'SUCCESS') {
      const order = await service.simOrder.getOrderByOrderId(info.out_trade_no);
      if(order.orderStatus === 2) {
        ctx.reply('OK');
        return ;
      }
      const simId = order.simId;
      const sim = await service.sim.getSimBySimId(order.simId);
      const pack = await service.comboPack.getComboPackById(order.cpid);
      await ctx.service.simOrder.update({ orderId: info.out_trade_no, orderStatus: 2, wxSerialNum: info.transaction_id });
      await ctx.service.simOrder.changeSim(sim, order);
      if (order.orderType === 1) {
        await service.chinaMobile.changeSimStatus(simId, OPER_TYPE_SINGLE.WAIT_ACTIVE);// 6: 待激活转已激活
        // await service.chinaMobile.operateSimApnFunction('0', simId); // 开启数据服务
       // await ctx.service.sim.syncUpdate(sim, false, false, '[controller->wechat->payBack]');
        this.app.queue.create('openFlowServ', { simId }).priority('high').ttl(1000*60*2).delay(10000*6*2) // 延时多少毫秒
        .removeOnComplete( true ).save();
      }
      if(sim.simType === SIM_TYPE.CALLED && sim.cardStatus === SIM_CARD_STATUS.STOP && sim.monthShengyuFlow > 0) {
        await service.chinaMobile.changeSimStatus(simId, OPER_TYPE_SINGLE.RECOVER);// 1: 停机转已激活
        await ctx.service.sim.syncUpdate(sim, false, false, '[controller->wechat->payBack]');
      }
      if (order.orderType === 2) {
        this.app.queue.create('openFlowServ', { simId }).priority('high').ttl(1000*60*2).delay(10000*6*2) // 延时多少毫秒
        .removeOnComplete( true ).save(); // 开启数据服务
      }
      if (order.orderType === 2) {
        await service.chinaMobile.operateSimCallFunction('0', simId); // 开启语音服务
      }
    } else {
      await ctx.service.simOrder.update({ orderId: info.out_trade_no, orderStatus: 0 });
    }
    ctx.reply('OK');
  }

}
module.exports = WechatController;
