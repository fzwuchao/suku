'use strict';
const Subscription = require('egg').Subscription;
const moment = require('moment');
class TokenCurl extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '40m', // 40 分钟间隔
      type: 'worker', // 让一个 worker执行
      immediate: true,
      disable: false,
      env: [ 'prod' ], // 定时任务，只在生产环境才执行
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
