'use strict';
const Subscription = require('egg').Subscription;
class SyncSimInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '240m', // 60 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
      disable: false,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service } = this.ctx;
    this.ctx.logger.info('********************同步更新*********************');
    await service.schedule.syncUpdateBatch();
  }
}

module.exports = SyncSimInfo;
