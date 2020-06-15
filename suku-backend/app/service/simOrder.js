/* eslint-disable no-case-declarations */
/* eslint-disable no-trailing-spaces */
/* eslint-disable default-case */
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
    const queryKey = {};
    if (simId) {
      where.simId = { [Op.substring]: simId };
      queryKey.simId = simId;
    }
    if (orderId) {
      where.orderId = { [Op.substring]: orderId };
      queryKey.orderId = orderId;
    }
    if (uid) {
      where.uid = uid;
      queryKey.uid = uid;
    } else {
      const curUser = this.getCurUser();
      const ids = await this.ctx.service.user.getAllUserIds([ curUser.id ]);
      where.uid = {
        [Op.in]: ids,
      };
      queryKey.uid = ids;
    }
    if (orderStatus !== undefined) {
      where.orderStatus = orderStatus;
      queryKey.orderStatus = orderStatus;
    }
    if (orderType) {
      where.orderType = orderType;
      queryKey.orderType = orderType;
    }
    const result = await this.findAndCountAll('SimOrder', pageSize, pageNum, {
      attributes,
      where,
    }, queryKey);
    return result;
  }
  async changeSim(sim, order) {
    const newSim = { id: sim.id };
    switch (order.orderType) {
      case 1: 
      case 4:
      case 3:
        newSim.shengyuMoney = sim.shengyuMoney + ((order.money - 0) + (order.awardMoney - 0));
        if (!sim.overdueTime || moment(new Date()).diff(moment(sim.overdueTime), 'years', true) >= 0) {
          newSim.shengyuMoney = newSim.shengyuMoney - sim.monthRent;
          order.months = order.months - 1; 
        }
        newSim.overdueTime = sim.overdueTime ? sim.overdueTime : new Date();
        const newTime = moment(newSim.overdueTime).add(order.months, 'M');
        newSim.overdueTime = new Date(((newTime.date(newTime.daysInMonth())).format('YYYY-MM-DD') + ' 23:59:59'));
        break;
      case 2:
        sim.monthOverlapFlow = sim.monthOverlapFlow + (order.flow - 0);
        sim.monthOverlapVoiceDuration = sim.monthOverlapVoiceDuration + (order.voice - 0);
        break;
    }
    await this.ctx.service.sim.update(newSim);
  }
  async create(order) {
    switch (order.orderType) {
      case 1:
        order.orderId = this.autoOrder(SimOrderService.ACTIVE_PREFIX, order.simId);
        break;
      case 2:
        order.orderId = this.autoOrder(SimOrderService.INCRE_PREFIX, order.simId);
        break;
      case 3:
        order.orderId = this.autoOrder(SimOrderService.DISCO_PREFIX, order.simId);
        break;
      case 4:
        order.orderId = this.autoOrder(SimOrderService.RENEW_PREFIX, order.simId);
        break;
    }
    order.orderStatus = 1;
    try {
      await this.app.model.SimOrder.create(order);
      this.app.redis.del('SimOrder*');
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
