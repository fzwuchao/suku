'use strict';
const Subscription = require('egg').Subscription;
const moment = require('moment');
class SyncSimInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '300000000000000m', // 30 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service, logger } = this.ctx;
    logger.info('********************同步卡基本信息*********************');
    const startTime = moment().milliseconds();
    const result = await service.getActivedSim();
    const promises = result.map(sim => {
      const { simId, simType } = sim;
      return service.syncUpdate(simId, simType);
    });
    Promise.all(promises).then(() => {
      const endTime = moment().milliseconds();
      logger.info(`【总同步更新，接口总响应时间：】:${endTime - startTime} ms`);
    });
  }
}

module.exports = SyncSimInfo;
