'use strict';

const BaseService = require('../core/baseService');

class WithdrawalRecordService extends BaseService {
  async save({uid, uname, amount, accId, account, aliasName, accName, accAddr, orderIds}) {
    const t = await this.getTransaction();
    const transaction = {transaction: t};
    const { service } = this.ctx;
    try {
      const wr = await this.app.model.WithdrawalRecord.create({
        uid, uname, amount, accId, account, aliasName, accName, accAddr
      }, transaction);
      const owMapList = orderIds.map(orderId => {
        return {
          orderId,
          withdrawalId: wr.id,
          uid,
        }
      })
      await service.orderWithdrawalMap.bulkSave(owMapList, transaction)
      await t.commit();
      return true;
    } catch (error) {
      this.ctx.logger.error(error);
      await t.rollback();
      return false;
    }
  }
  async getWithdRecordListPage(query) {
    const { pageSize, pageNum } = query;
    const where = {};
    const curUser = this.getCurUser();
    where.uid = curUser.id;
    const result = await this.findAndCountAll('WithdrawalRecord', pageSize, pageNum, {
      where,
    });
    return result;
  }
}

module.exports = WithdrawalRecordService;
