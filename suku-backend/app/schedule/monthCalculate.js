'use strict';
const Subscription = require('egg').Subscription;
class MonthCalculate extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 4 1 * *', // 每月1号凌晨4点执行
      type: 'all', // 指定所有的 worker 都需要执行
      disable: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service } = this.ctx;
    await service.schedule.monthCalculate();
  }
}

module.exports = MonthCalculate;
