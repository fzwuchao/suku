'use strict';

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class MessageSendService extends BaseService {

  async getMessageSendPage(query) {
    const attributes = [ 'id', 'simId', 'senderId', 'sender', 'orderNo', 'retmesg', 'content', 'gwid', 'createdAt', 'retcode' ];
    const { pageSize, pageNum, senderId, simId, retcode } = query;
    const Op = this.getOp();
    const where = {};

    if (simId) {
      where.simId = { [Op.substring]: simId };
    }
    if (senderId) {
      where.senderId = senderId;
    } else {
      const curUser = this.getCurUser();
      const ids = await this.ctx.service.user.getAllUserIds([ curUser.id ]);
      where.senderId = {
        [Op.in]: ids,
      };
    }
    if (retcode) {
      where.retcode = retcode;
    }
    const result = await this.findAndCountAll('MessageSend', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }

  async getSendlistBySimId(query) {
    const attributes = [ 'id', 'content', 'createdAt', 'retcode' ];
    const { simId } = query;
    const Op = this.getOp();
    const where = {};

    if (simId) {
      where.simId = { [Op.substring]: simId };
    }

    const result = await this.app.model.MessageSend.findAll({ attributes,
      where,
    });
    return result;
  }

  async create(messageSend) {
    try {
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
