'use strict';

const BaseService = require('../core/baseService');
const moment = require('moment');
// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class SimOrderService extends BaseService {


  autoOrder(prefix, simId) {
    const { helper } = this.ctx;
    const dateFormat = moment().format('HHmmss');
    const str = `${prefix}${simId}T${dateFormat}R${helper.rnd(1000, 9999)}`;
    return str;
  }

  async getSimOrderPage(query) {
    const attributes = [ 'id', 'orderId', 'simId', 'uname', 'cname', 'dealAmount', 'renewIncrAmount', 'cpname', 'wxSerialNum', 'orderStatus', 'createdAt' ];
    const { pageSize, pageNum, orderId, simId, uid, orderStatus, orderType } = query;
    const Op = this.getOp();
    const where = {};

    if (simId) {
      where.simId = { [Op.substring]: simId };
    }
    if (orderId) {
      where.orderId = { [Op.substring]: orderId };
    }
    if (uid) {
      where.uid = uid;
    } else {
      const curUser = this.getCurUser();
      const ids = await this.ctx.service.user.getAllUserIds(curUser.id);
      where.uid = {
        [Op.in]: ids,
      };
    }
    if (orderStatus !== undefined) {
      where.orderStatus = orderStatus;
    }
    if (orderType) {
      where.orderType = orderType;
    }
    const result = await this.findAndCountAll('SimOrder', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }

  async create(messageSend) {
    try {
      const curUser = this.getCurUser();
      messageSend.sender = curUser.name;
      messageSend.senderId = curUser.id;
      messageSend.orderNo = SimOrderService.ORDER_NO_PREFIX + this.autoOrder(10);
      await this.app.model.MessageSend.create(messageSend);
    } catch (e) {
      return false;
    }
    return true;
  }

}

SimOrderService.ACTIVE_PREFIX = 'PRE'; // 激活订单前缀
SimOrderService.INCRE_PREFIX = 'INCRE'; // 叠加订单前缀
SimOrderService.DISCO_PREFIX = 'DISCO'; // 特惠订单前缀
SimOrderService.RENEW_PREFIX = 'RENEW'; // 续费订单前缀

module.exports = SimOrderService;
