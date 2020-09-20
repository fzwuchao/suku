'use strict';
const Subscription = require('egg').Subscription;
class SyncSimInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '480m', // 60 分钟间隔
      type: 'worker',
      disable: false,
      env: [ 'prod' ], // 定时任务，只在生产环境才执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service } = this.ctx;
    this.ctx.logger.info('********************总同步更新*********************');
    await service.schedule.syncUpdateBatch({
      isActive: 1,
      simType: 'B'
    });
    await service.schedule.syncUpdateBatch({
      simType: 'A'
    });
  }
}

module.exports = SyncSimInfo;
