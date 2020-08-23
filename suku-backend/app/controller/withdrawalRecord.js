'use strict';
const BaseController = require('../core/baseController');

class WithdrawalRecordController extends BaseController {
  // 
  async save() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { withdrawalRecord } = helper.rules;
    const rule = {
      ...withdrawalRecord(),
    };
    ctx.validate(rule, request.body);
    const { orderIds, accId, amount } = request.body;
    const oIds = orderIds.split(',');
    const user = this.getCurUser();
    const wbAccount = await service.wbAccount.getWbAccountById(accId);
    const result = await service.withdrawalRecord.save({
      uid: user.id,
      uname: user.name,
      amount,
      accId,
      account: wbAccount.account,
      aliasName: wbAccount.aliasName,
      accName: wbAccount.acName,
      accAddr: wbAccount.acAddr,
      orderIds: oIds,
    });
    if (result) {
      this.success('', '提现成功')
    } else {
      this.fail('', '', '提现失败')
    }
  }

  async getWithdRecordList() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { pageRules, withdrawalRecord } = helper.rules;

    const rule = {
      ...withdrawalRecord(),
      ...pageRules,
    };
    ctx.validate(rule, request.query);
    const result = await ctx.service.withdrawalRecord.getWithdRecordListPage(request.query);
    this.success(result, '');
  }

}
module.exports = WithdrawalRecordController;
