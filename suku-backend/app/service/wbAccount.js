'use strict';

const BaseService = require('../core/baseService');

// user表名
// const TABLE_USER = 'wb_account';
class WbAccountService extends BaseService {

  async getAccountListPage(query) {
    const attributes = [ 'id', 'aliasName','account', 'acName', 'acAddr','createdAt' ];
    const { pageSize, pageNum } = query;
    const where = {};
    const curUser = this.getCurUser();
    where.uid = curUser.id;
    const result = await this.findAndCountAll('WbAccount', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }
  
  async getAllAccount() {
    const where = {};
    const curUser = this.getCurUser();
    where.uid = curUser.id;
    const results = await this.app.model.WbAccount.findAll({ where });
    return results;
  }

  async create(account) {
    const { logger } = this.ctx;
    try {
      await this.app.model.WbAccount.create(account);
    } catch (e) {
      logger.error(e);
    }
    return true;
  }
  async update(account,id) {
    try {
      await this.app.model.WbAccount.update(account,{where:{id}});
    } catch (e) {
      return false;
    }
    return true;
  }
  async getWbAccountById(id) {
    try {
      return await this.app.model.WbAccount.findByPk(id);
    } catch (error) {
      this.ctx.logger.error(error);
      return false;
    }
  }

}
module.exports = WbAccountService;
