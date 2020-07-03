'use strict';
const Subscription = require('egg').Subscription;
const moment = require('moment');
class Message extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '59m', // 59 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
      immediate: true,
      disable: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service, logger } = this.ctx;
    logger.info('********************查询上行短信记录*********************');
    const startTime = moment().milliseconds();
    // 获取上行短信
    const result = await service.chinaMobile.sendUpgoingMessage('1', '2');
    if (result.success) {
      const { messageData } = result.data;
      const simIds = messageData.map(item => item.simId);
      const simIdToUserMap = await service.sim.getSimIdToUserMapBySimIds(simIds);
      const msgUpgoingList = messageData.map(data => {
        const user = simIdToUserMap[data.simId];
        return {
          ...data,
          ...user,
        };
      });
      await service.messageUpgoing.batchSave(msgUpgoingList);
    }
    const endTime = moment().milliseconds();
    logger.info(`【查询上短信记录，并入库总时间：】:${endTime - startTime} ms`);
  }
}

module.exports = Message;
