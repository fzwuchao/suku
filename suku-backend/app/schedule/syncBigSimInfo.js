'use strict';
const Subscription = require('egg').Subscription;
const { Op } = require('sequelize');
class SyncSimInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '30m', // 60 分钟间隔
      type: 'worker',
      immediate: true,
      disable: false,
      env: [ 'prod' ], // 定时任务，只在生产环境才执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service } = this.ctx;
    this.ctx.logger.info('********************同步大流量卡*********************');
    await service.schedule.syncUpdateBatch({
      isActive: 1,
      simType: 'B',
      monthOverlapFlow: {[Op.gt]: 0},
      simId:{[Op.gt]: 100000000000}
    });
  }
}

module.exports = SyncSimInfo;
