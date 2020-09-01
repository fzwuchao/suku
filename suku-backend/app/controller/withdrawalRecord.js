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

  async checkOrders() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { pageRules } = helper.rules;

    const rule = {
      ...pageRules,
    };
    ctx.validate(rule, request.query);
    const result = await ctx.service.withdrawalRecord.getOrderByWithdrawalId(request.query);
    this.success(result, '');
  }
  async exportExcel() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { withdrawalRecord } = helper.rules;

    const rule = {
      ...withdrawalRecord(),
    };

    const params = request.body;
    ctx.validate(rule, params);
    const ids = params.ids.split(',')
    const result = await service.withdrawalRecord.updateToProcessedStatus(ids);
    if (!result) {
      this.fail(null, null, '更新成已处理状态失败')
      return;
    }
    const excelData = await service.withdrawalRecord.getWithdRecords(ids);
    const jsonExcel = JSON.parse(JSON.stringify(excelData, null, 2));
    const buffer = await service.sheet.generateWorkbookBuffer(jsonExcel);
    // application/octet-stream application/vnd.openxmlformats application/msexcel
    this.ctx.set('Content-Type', 'application/msexcel');
    this.ctx.set('Content-disposition', 'attachment; filename=1.xlsx');
    // this.success(buffer, '');
    this.ctx.body = buffer;
  }

}
module.exports = WithdrawalRecordController;
