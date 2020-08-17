'use strict';

const BaseService = require('../core/baseService');

class OrderWithdrawalMapService extends BaseService {
  async getOrderIdsByUids(uids) {
    const attributes = ['orderId'];
    const Op = this.getOp();
    const orderIds = await this.app.model.OrderWithdrawalMap.findAll({
      attributes,
      where: {
        uid: {
          [Op.in]: uids,
        },
      },
    });
    const oIds = [];
    for (let i = 0; i < orderIds.length; i++) {
      oIds.push(orderIds[i].orderId);
    }
    return oIds;
  }


}

module.exports = OrderWithdrawalMapService;
