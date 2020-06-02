'use strict';

const { Service } = require('egg');
const { Op } = require('sequelize');
class BaseService extends Service {

  getCurUser() {
    const curUser = this.ctx.helper.loginUser.parse(this.ctx.cookies.get('loginUserInfo')) || {};
    return curUser;
  }
  getOp() {
    return Op;
  }

  async findAndCountAll(modelNmale, pageSize, pageNum, query) {
    const { helper } = this.ctx;
    const result = await this.app.model[modelNmale].findAndCountAll({ where: query, ...helper.pageQueryModel(pageSize, pageNum) });

    return helper.pageModel(result, pageSize, pageNum);
  }

}

module.exports = BaseService;
