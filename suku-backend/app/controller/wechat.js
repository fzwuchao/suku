'use strict';

const BaseController = require('../core/baseController');
const {
  SERV_STATUS,
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
    //   out_trade_no: 'PRE1440229284001T020707R8413',
    //   transaction_id: '4200000713202007292278385978',
    // };
    if (info.return_code === 'SUCCESS') {
      const order = await service.simOrder.getOrderByOrderId(info.out_trade_no);
      const simId = order.simId;
      const sim = await service.sim.getSimBySimId(order.simId);
      const pack = await service.comboPack.getComboPackById(order.cpid);
      await ctx.service.simOrder.update({ orderId: info.out_trade_no, orderStatus: 2, wxSerialNum: info.transaction_id });
      await ctx.service.simOrder.changeSim(sim, order);
      if (order.orderType === 1) {
        await service.chinaMobile.changeSimStatus(simId, 6);// 6: 待激活转已激活
        // await service.chinaMobile.operateSimApnFunction('0', simId); // 开启数据服务
        this.app.queue.create('openFlowServ', { simId }).priority('high').delay(10000*6*2) // 延时多少毫秒
          .save();
      }
      if (order.orderType === 2 && (pack.monthFlow - 0) > 0 && sim.flowServStatus === SERV_STATUS.OFF) {
        await service.chinaMobile.operateSimApnFunction('0', simId); // 开启数据服务
      }
      if (order.orderType === 2 && (pack.monthVoice - 0) > 0 && sim.voiceServStatus === SERV_STATUS.OFF) {
        await service.chinaMobile.operateSimCallFunction('0', simId); // 开启语音服务
      }
      await ctx.service.sim.syncUpdate(sim);

    } else {
      await ctx.service.simOrder.update({ orderId: info.out_trade_no, orderStatus: 0 });
    }
    ctx.reply();
  }

}
module.exports = WechatController;
