'use strict';

const BaseController = require('../core/baseController');
class WbAccountController extends BaseController {

  async getAccountList() {
    const { ctx } = this;
    const { request, helper } = ctx;
    const { pageRules, wbAccount } = helper.rules;

    const rule = {
      ...wbAccount(),
      ...pageRules,
    };
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const result = await ctx.service.wbAccount.getAccountListPage(request.query);
    this.success(result, '');
  }

  async save() {
    const { ctx } = this;
    const { request, helper, service } = ctx;
    let rule = null;
    rule = helper.rules.wbAccount([ 'account', 'acName', 'acAddr' ]);
    ctx.validate(rule, request.body);
    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    const { account, acName, acAddr, aliasName, id } = request.body;
    const wbAccount = {
      account,
      acName,
      acAddr
    };
    if(aliasName) {
      wbAccount.aliasName = aliasName;
    }
    const curUser = this.getCurUser();
    wbAccount.uid = curUser.id;
    if(id) {
      await service.wbAccount.update(wbAccount, id);
    } else {
      await service.wbAccount.create(wbAccount);
    }
    this.success(true, '');
  }

  async getAllAccount() {
    const result = await this.ctx.service.wbAccount.getAllAccount();
    this.success(result, '');
  }
}
module.exports = WbAccountController;
