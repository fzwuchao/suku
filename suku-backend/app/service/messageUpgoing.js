'use strict';

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class MessageUpgoingService extends BaseService {

  async getMessageUpgoingPage(query) {
    const attributes = [ 'id', 'simId', 'uid', 'uname', 'content', 'createdAt' ];
    const { pageSize, pageNum, uid, simId } = query;
    const Op = this.getOp();
    const where = {};

    if (simId) {
      where.simId = { [Op.substring]: simId };
    }
    if (uid) {
      where.uid = uid;
    } else {
      const curUser = this.getCurUser();
      let ids = [];
      if (curUser.roleLevel <= 1) {
        ids = await this.ctx.service.user.getAllUserIds();
      } else {
        ids = await this.ctx.service.user.getAllUserIdsByPid([ curUser.id ]);
      }
      where.uid = {
        [Op.in]: ids,
      };
    }
    const result = await this.findAndCountAll('MessageUpgoing', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }
  async getMessageUpgoingBySimId({ simId }) {
    const attributes = [ 'content', 'createdAt' ];
    const result = await this.app.model.MessageUpgoing.findAll({
      attributes,
      where: { simId },
    });
    return result;
  }
  async create(messageUpgoing) {
    try {
      const curUser = this.getCurUser();
      messageUpgoing.uname = curUser.name;
      messageUpgoing.uid = curUser.id;
      await this.app.model.MessageUpgoing.create(messageUpgoing);
    } catch (e) {
      return false;
    }
    return true;
  }

  async batchSave(msgUpgoingList) {
    // const t = await this.getTransaction();
    // const transaction = { transaction: t };
    try {
      // await this.app.model.MessageUpgoing.destroy({
      //   truncate: true,
      //   force: true,
      //   ...transaction,
      // });
      // await this.app.model.MessageUpgoing.bulkCreate(msgUpgoingList, { ...transaction });
      // await t.commit();
      await this.app.model.MessageUpgoing.bulkCreate(msgUpgoingList);
    } catch (e) {
      this.ctx.logger.error(e);
      // await t.rollback();
      return false;
    }
    return true;
  }
}

module.exports = MessageUpgoingService;
