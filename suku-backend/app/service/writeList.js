'use strict';

const BaseService = require('../core/baseService');
// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class WriteListService extends BaseService {

  async getWriteListPage(query) {
    const attributes = [ 'id', 'simId', 'uname', 'phone', 'createdAt' ];
    const { pageSize, pageNum, status, simId, uid } = query;
    const Op = this.getOp();
    const where = {};

    if (simId) {
      where.simId = { [Op.substring]: simId };
    }
    if (uid) {
      where.uid = uid;
    } else {
      const curUser = this.getCurUser();
      const ids = await this.ctx.service.user.getAllUserIds([ curUser.id ]);
      where.uid = {
        [Op.in]: ids,
      };
    }
    if (status !== undefined) {
      where.status = status;
    }
    const result = await this.findAndCountAll('WriteList', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }

  async create(messageSend) {
    try {
      const curUser = this.getCurUser();
      messageSend.sender = curUser.name;
      messageSend.senderId = curUser.id;
      await this.app.model.MessageSend.create(messageSend);
    } catch (e) {
      return false;
    }
    return true;
  }

}
module.exports = WriteListService;
