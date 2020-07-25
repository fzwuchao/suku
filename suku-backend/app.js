// app.js
'use strict';
class AppBootHook {
  constructor(app) {
    this.app = app;
  }


  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用

    // 例如：从数据库加载数据到内存缓存
    // this.app.cacheData = await this.app.model.query(QUERY_CACHE_SQL);
    // this.app.use(bodyParser({
    //   enableTypes: [ 'json', 'form', 'text' ],
    //   extendTypes: {
    //     text: [ 'text/xml', 'application/xml' ],
    //   },
    // }));
  }
  async didReady() {
    // 应用已经启动完毕

    const ctx = await this.app.createAnonymousContext();
    ctx.logger.info('********************初始化队列*********************');
    this.app.queue.process('jobLog', (job, done) => {
      // 这里可以调用service里面的方法来消费这些信息
      // const ctx = this.app.createAnonymousContext();
      var domain = require('domain').create();
      domain.on('error', function(err){
        done(err);
      });
      domain.run(function(){ // your process functio
        ctx.service.jobLog.dealUnfinishedJobs(job.data, done); // dealOrder是自定义的方法
        done();
      });
    });
    this.app.queue.process('openFlowServ', 12, (job, done) => {
      // 这里可以调用service里面的方法来消费这些信息
      // const ctx = this.app.createAnonymousContext();
      ctx.service.jobLog.openFlowServ(job.data, done); // dealOrder是自定义的方法
    });

    this.app.queue.process('BatchSyncUpdate', 4, (job, done) => {
      // 这里可以调用service里面的方法来消费这些信息
      // const ctx = this.app.createAnonymousContext();
      var domain = require('domain').create();
      domain.on('error', function(err){
        done(err);
      });
      domain.run(function(){ // your process functio
        ctx.service.jobLog.BatchSyncUpdate(job.data, done); // dealOrder是自定义的方法
        done();
      });
    });

    this.app.queue.process('MigratBatchSyncUpdate', 4,(job, done) => {
      // 这里可以调用service里面的方法来消费这些信息
      // const ctx = this.app.createAnonymousContext();
      var domain = require('domain').create();
      domain.on('error', function(err){
        done(err);
      });
      domain.run(function(){ // your process functio
        ctx.service.jobLog.MigratBatchSyncUpdate(job.data, done); // dealOrder是自定义的方法
        done();
      });
      
    });

    this.app.queue.process('configLimtValue', 4 ,(job, done) => {
      // 这里可以调用service里面的方法来消费这些信息
      // const ctx = this.app.createAnonymousContext();
      var domain = require('domain').create();
      domain.on('error', function(err){
        done(err);
      });
      domain.run(function(){ // your process functio
        ctx.service.jobLog.configLimtValue(job.data, done); // dealOrder是自定义的方法
        done();
      });
      
    });
  }

}

module.exports = AppBootHook;
