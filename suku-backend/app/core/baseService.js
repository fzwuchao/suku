'use strict';

const { Service } = require('egg');
class BaseService extends Service {
  async findAndCountAll(modelNmale, pageSize, pageNum, query) {
    const { helper } = this.ctx;
    const result = await this.app.model[modelNmale].findAndCountAll({ where: query, ...helper.pageQueryModel(pageSize, pageNum) });

    return helper.pageModel(result, pageSize, pageNum);
  }

}

module.exports = BaseService;
