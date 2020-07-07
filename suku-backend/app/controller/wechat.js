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
    const { request, service } = ctx;
    const info = request.weixin;
    if (info.return_code === 'SUCCESS') {
      const order = service.simOrder.getOrderByOrderId(info.out_trade_no);
      const simId = order.simId;
      const sim = service.sim.getSimBySimId(order.simId);
      const pack = this.ctx.service.comboPack.getComboPackById(order.cpid);
      await ctx.service.simOrder.changeSim(sim, order);
      await ctx.service.simOrder.update({ orderId: info.out_trade_no, orderStatus: 2, wxSerialNum: info.transaction_id });
      if (order.orderType === 1) {
        await service.chinaMobile.changeSimStatus(simId, 6);// 6: 待激活转已激活
        await service.chinaMobile.operateSimApnFunction('0', simId); // 开启数据服务
      }
      if (order.orderType === 2 && (pack.flow - 0) > 0 && sim.flowServStatus === SERV_STATUS.OFF) {
        await service.chinaMobile.operateSimApnFunction('0', simId); // 开启数据服务
      }
      if (order.orderType === 2 && (pack.voice - 0) > 0 && sim.voiceServStatus === SERV_STATUS.OFF) {
        await service.chinaMobile.operateSimCallFunction('0', simId); // 开启语音服务
      }
      await ctx.service.sim.syncUpdate(simId, sim.simType);

    } else {
      await ctx.service.simOrder.update({ orderId: info.out_trade_no, orderStatus: 0 });
    }
    ctx.reply();
  }

}
module.exports = WechatController;
