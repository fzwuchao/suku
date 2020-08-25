'use strict';
const { WITHDRAWAL_RECORD_STATUS } = require('../extend/constant')();
const moment = require('moment');
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
  // 更新为已处理状态
  async updateToProcessedStatus(ids) {
    const Op = this.getOp();
    try {
      await this.app.model.WithdrawalRecord.update(
        { status: WITHDRAWAL_RECORD_STATUS.PROCESSED },
        {
          where: {
            id: { [Op.in]: ids }
          }
        }
      );
      return true;
    } catch (error) {
      this.ctx.logger.error(error);
      return false;
    }
  }
  async getWithdRecords(ids) {
    const Op = this.getOp();
    const attributes = [
      ['id', 'ID'],
      ['uname', '用户名'],
      ['amount', '提现金额'],
      ['account', '账户号'],
      ['acc_name', '账户名'],
      ['acc_addr', '开户行'],
      ['updated_at', '提现时间']
    ];
    const result = await this.app.model.WithdrawalRecord.findAll({
      attributes,
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
    const newRes = [];
    result.forEach(res => {
      const dValues = res.dataValues;
      const excelRow = {};
      Object.keys(dValues).forEach(key => {
        if (key === '提现时间') {
          excelRow[key] = moment(dValues[key]).format('YYYY-MM-DD HH:mm:ss');
        } else {
          excelRow[key] = dValues[key]
        }
      })
      newRes.push(excelRow);
    })
    return newRes;
  }
}

module.exports = WithdrawalRecordService;
