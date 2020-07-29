'use strict';
const Subscription = require('egg').Subscription;
class DelLog extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 0 */1 * *', // 每隔2天执行一次
      type: 'all', // 指定所有的 worker 都需要执行

    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service } = this.ctx;
    await service.schedule.deleteLogs();
  }
}

module.exports = DelLog;
