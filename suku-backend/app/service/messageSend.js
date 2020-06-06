'use strict';

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class MessageSendService extends BaseService {

  async getSimLogisticsPage(query) {
    const attributes = [ 'id', 'simId', 'senderId', 'sender', 'orderNo', 'retmesg', 'content', 'gwid', 'createdAt', 'retcode' ];
    const { pageSize, pageNum, senderId, simId, retmesg } = query;
    const Op = this.getOp();
    const where = {};
    if (simId) {
      where.simId = { [Op.substring]: simId };
    }
    if (senderId) {
      where.senderId = senderId;
    }
    if (retmesg) {
      where.retmesg = retmesg;
    }
    const result = await this.findAndCountAll('MessageSend', pageSize, pageNum, {
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
      messageSend.orderNo = MessageSendService.ORDER_NO_PREFIX + this.autoOrder(10);
      await this.app.model.MessageSend.create(messageSend);
    } catch (e) {
      return false;
    }
    return true;
  }

}

MessageSendService.ORDER_NO_PREFIX = 'MSG';

module.exports = MessageSendService;
