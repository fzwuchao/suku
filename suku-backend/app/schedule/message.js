'use strict';
const Subscription = require('egg').Subscription;
const moment = require('moment');
class Message extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '3m',
      type: 'worker', // 让一个worker执行
      immediate: true,
      disable: false,
      env: [ 'prod' ], // 定时任务，只在生产环境才执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service, logger } = this.ctx;
    logger.info('********************查询上行短信记录*********************');
    const startTime = moment().milliseconds();
    // 获取上行短信
    const result = await service.chinaMobile.sendUpgoingMessage();
    if (result.success) {
      const { messageData } = result.data;
      const simIds = messageData.map(item => item.simId);
      const simIdToUserMap = await service.sim.getSimIdToUserMapBySimIds(simIds);
      const msgUpgoingList = [];
      for (let i = 0; i < messageData.length; i++) {
        const user = simIdToUserMap[messageData[i].simId];
        if (user) {
          msgUpgoingList.push({
            ...messageData[i],
            ...user,
          });
        }
      }
      this.ctx.logger.info('----------- msgUpgoingList:', msgUpgoingList);
      if (msgUpgoingList.length > 0) {
        await service.messageUpgoing.batchSave(msgUpgoingList);
      }
    }
    const endTime = moment().milliseconds();
    logger.info(`【查询上短信记录，并入库总时间：】:${endTime - startTime} ms`);
  }
}

module.exports = Message;
