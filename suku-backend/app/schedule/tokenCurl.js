'use strict';
const Subscription = require('egg').Subscription;
const moment = require('moment');
class TokenCurl extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '59m', // 59 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
      immediate: true,
      disable: false,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { service, logger } = this.ctx;
    logger.info('********************获取token*********************');
    const startTime = moment().milliseconds();
    await service.chinaMobile.getTokenCurl();
    const endTime = moment().milliseconds();
    logger.info(`【获取启用平台的token，接口总响应时间：】:${endTime - startTime} ms`);
  }
}

module.exports = TokenCurl;
