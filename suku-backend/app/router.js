'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // app.beforeStart(async () => {
  //   await app.model.sync(); // model与数据库表同步，表不存在时自动创建，存在时忽略
  // });

  // 登录
  router.post('/login', controller.login.login);

  // 退出登录
  router.put('/logout', controller.login.logout);

  // 获取验证码
  router.get('/getCaptcha', controller.captcha.getCaptcha);

  // 导入
  router.post('/import', controller.sheet.importFile);

  // 导出
  router.post('/export', controller.user.exportFile);
};
