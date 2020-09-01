/* eslint-disable no-case-declarations */
/* eslint-disable no-trailing-spaces */
/* eslint-disable default-case */
'use strict';

const BaseService = require('../core/baseService');
const moment = require('moment');
const calc = require('calculatorjs');
// const { orderType } = require('../extend/rules/simOrder');
// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';
const { LIMT_OPTY, SIM_CARD_STATUS, SIM_FLOW_SERV_STATUS, ORDER_STATUS } = require('../extend/constant')();
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
      let ids = [];
      if (curUser.roleLevel <= 1) {
        ids = await this.ctx.service.user.getAllUserIds();
      } else {
        ids = await this.ctx.service.user.getAllUserIdsByPid([ curUser.id ]);
      }
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

  async getOrdersByids (ids, query) {
    const attributes = [ 'id', 'orderId', 'simId', 'uname', 'cname', 'dealAmount', 'renewIncrAmount', 'cpname', 'wxSerialNum', 'orderStatus', 'createdAt' ];
    const { pageSize, pageNum} = query;
    const Op = this.getOp();
    const where = {};
    
    where.id = {
      [Op.in]: ids,
    }
    
    const result = await this.findAndCountAll('SimOrder', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }


  async getWithdrawalSimOrder(query) {
    const attributes = [ 'id', 'orderId', 'simId', 'uid', 'uname', 'cname', 'dealAmount', 'renewIncrAmount', 'cpname', 'wxSerialNum', 'orderStatus', 'createdAt' ];
    const { pageSize, pageNum } = query;
    const Op = this.getOp();
    const where = {};
    const curUser = this.getCurUser();
    const userToRateMap = {};
    // 当前用户信息
    const curUserInfo = await this.ctx.service.user.getUserById(curUser.id);
    userToRateMap[curUserInfo.id] = curUserInfo.rate;
    const roleId = curUser.roleId;
    // 当前用户已经提现过的订单ids
    const orderIds = await this.ctx.service.orderWithdrawalMap.getOrderIdsByUids([curUser.id]);
    let uids = [];
    let rateAmount = 0;
    let totalA = 0;
    let tRate = 0;
    
    if (roleId === 7) {
      // 经销商
      // 当前用户的下一级用户
      const nextUsers = await this.ctx.service.user.getAllNextUserByPid(curUser.id);
      const nextUserIds = nextUsers.map(item => {
        userToRateMap[item.id] = item.rate;
        return item.id;
      });
      uids = [ curUser.id ].concat(nextUserIds);
      // 当前用户及下一级用户的所有订单金额
      const nextUserOrderAmount = await this.getWithdrawalOrderAmountGroupByUid(nextUserIds, orderIds);
      let count = 0;
      nextUserOrderAmount.forEach(item => {
        const totalStr = item.dataValues['total'];
        const total = Number(totalStr ? totalStr : 0);
        const rateStr = userToRateMap[item.uid];
        let rate = 0;
        if (rateStr) {
          rate = Number(rateStr);
        }
        count = calc(`${count} + (${total} * ${rate})`); // (1 - rate) * total;

      });
      const curUserAmount = await this.getWithdrawalOrderAmountGroupByUid([ curUser.id ], orderIds);
      if (curUserAmount && curUserAmount.length > 0) {
        const totalStr = curUserAmount[0].dataValues['total'];
        totalA = Number(totalStr ? totalStr : 0);
      }
      const rateStr = userToRateMap[curUser.id];
      if (rateStr) {
        tRate = Number(rateStr);
      }
      rateAmount = calc(`${totalA} * ${tRate} - ${count}`) // totalA * rate + count; 
    } else if (roleId === 6) {
      // 分销商
      uids = [ curUser.id ];
      const curUserAmount = await this.getWithdrawalOrderAmountGroupByUid([ curUser.id ], orderIds);
      if (curUserAmount && curUserAmount.length > 0) {
        const totalStr = curUserAmount[0].dataValues['total'];
        totalA = Number(totalStr ? totalStr : 0);
      }
      const rateStr = userToRateMap[curUser.id];
      if (rateStr) {
        tRate = Number(rateStr);
      }
      rateAmount = calc(`${totalA} * ${tRate}`);
    }
    where.uid = {
      [Op.in]: uids,
    };
    where.orderStatus = ORDER_STATUS.SUCCESS;
    if (orderIds && orderIds.length > 0) {
      where.id = {
        [Op.notIn]: orderIds,
      };

    }
    
    const result = await this.findAndCountAll('SimOrder', pageSize, pageNum, {
      attributes,
      where,
    });
    let list = [];
    result.list.forEach(order => {
      const dealAmountStr = order.dataValues['dealAmount'];
      const rateStr = userToRateMap[order.dataValues['uid']];
      const dealAmount = dealAmountStr ? Number(dealAmountStr) : 0;
      const rate = rateStr && curUserInfo.id !== order.dataValues['uid'] ? Number(rateStr) : 0;
      if (roleId === 7) {
        list.push({
          ...order.dataValues,
          rateAmount:  calc(`${dealAmount} * ${tRate} - ${dealAmount} * ${rate}`)
        })
      } else if (roleId === 6) {
        list.push({
          ...order.dataValues,
          rateAmount:  calc(`${dealAmount} * ${tRate}`)
        })
      }
      
    })
    const newRes = { ...result, list };
    return { ...newRes, rateAmount, totalA };
  }

  async getWithdrawalOrderAmountGroupByUid(uids, orderIds) {
    const attributes = [
      'uid',
      [ this.app.model.fn('SUM', this.app.model.col('deal_amount')), 'total' ],
    ];
    const Op = this.getOp();
    const simOrder = await this.app.model.SimOrder.findAll({
      attributes,
      where: {
        uid: {
          [Op.in]: uids,
        },
        id: {
          [Op.notIn]: orderIds,
        },
        orderStatus: ORDER_STATUS.SUCCESS,
      },
      group: 'uid',
    });
    return simOrder;
  }
  async changeSim(sim, order) {
    const newSim = {};
    const pack = await this.ctx.service.comboPack.getComboPackById(order.cpid);
    let packMonths = 1
    if(pack) {
      const packMoney = calc(`${pack.awardMoney ? pack.awardMoney : 0} + ${pack.money ? pack.money : 0}`).toFixed(2);
      packMonths = calc(`${packMoney ? packMoney : 0}/${sim.monthRent ? sim.monthRent : 1}`);
    } else {
      packMonths = calc(`${sim.renewPrice} / ${sim.monthRent}`);
    }
    
    const operType = LIMT_OPTY.UPDATE;
    let limtValue = 0;
    // pack.months = packMonths;
    // pack.money = calc(`${pack.money ? pack.money : 0}+(${this.sim.privateMoney ? this.sim.privateMoney : 0}*${packMonths})`).toFixed(2);
    switch (order.orderType) {
      case 1: 
      case 4:
      case 3:
        newSim.shengyuMoney = calc(`${sim.shengyuMoney ? sim.shengyuMoney : 0} + ((${sim.monthRent}+${sim.privateMoney}) * ${packMonths})`);
        if (!sim.overdueTime || moment(new Date()).diff(moment(sim.overdueTime), 'years', true) >= 0) {
          newSim.shengyuMoney = calc(`${newSim.shengyuMoney} - ${sim.monthRent}`);
          newSim.overdueTime = new Date();
          order.months = packMonths - 1; 
        } else {
          newSim.overdueTime = sim.overdueTime
          order.months = packMonths;
        }
        newSim.cardStatus = SIM_CARD_STATUS.ACTIVE;
        newSim.flowServStatus = SIM_FLOW_SERV_STATUS.ON;
        const newTime = moment(newSim.overdueTime).add(order.months, 'M');
        newSim.overdueTime = new Date(((newTime.date(newTime.daysInMonth())).format('YYYY-MM-DD') + ' 23:59:59'));
        break;
      case 2:
        newSim.monthOverlapFlow = calc(`${sim.monthOverlapFlow ? sim.monthOverlapFlow : 0} + ${pack.monthFlow ? pack.monthFlow : 0}`);
        newSim.monthOverlapVoiceDuration = calc(`${sim.monthOverlapVoiceDuration ? sim.monthOverlapVoiceDuration : 0} + ${pack.monthVoice ? pack.monthVoice : 0}`); 
        const shengyuFlow = calc(`${sim.monthFlow} + ${newSim.monthOverlapFlow} - ${sim.monthUsedFlow || 0} * ${sim.virtualMult}`)
        if (shengyuFlow > 0) {
          newSim.flowServStatus = SIM_FLOW_SERV_STATUS.ON;
        }
        await this.ctx.service.sim.configLimtValueBySim(sim);
        break;
    }
    if (order.orderType === 1) {
      newSim.isActive = 1;
      await this.ctx.service.sim.configLimtValueBySim(sim);;
    }
    await this.ctx.service.sim.updateBySimId(newSim, sim.simId);

    
  }
  async update(order) {
    try {
      return await this.app.model.SimOrder.update(order, { where: { orderId: order.orderId } });
    } catch (e) {
      return false;
    }
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
      const result = await this.app.model.SimOrder.create(order);
      this.app.redis.del('SimOrder*');
      return result;
    } catch (e) {
      return false;
    }
  }

  async getOrderByOrderId(orderId) {
    const [ simOrder ] = await this.app.model.SimOrder.findAll({
      where: {
        orderId,
      },
    });

    return simOrder;
  }


}

SimOrderService.ACTIVE_PREFIX = 'PRE'; // 激活订单前缀
SimOrderService.INCRE_PREFIX = 'INCRE'; // 叠加订单前缀
SimOrderService.DISCO_PREFIX = 'DISCO'; // 特惠订单前缀
SimOrderService.RENEW_PREFIX = 'RENEW'; // 续费订单前缀

module.exports = SimOrderService;
