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
  // router.post('/import', controller.sheet.importFile);

  // 导出
  // router.post('/export', controller.user.exportFile);

  // 获取角色的权限
  router.get('/permission', controller.permission.getPermission);

  // 创建sim卡
  router.post('/sim/save', controller.sim.save);

  // 查询sim卡
  router.get('/sim/search', controller.sim.search);

  // 获取用户列表
  router.get('/searchUser', controller.user.getUserlist);
  // 根据用户名获取用户
  router.get('/getUserByUsername', controller.user.getUserByUsername);


  // 获取权限列表
  router.get('/searchRole', controller.role.getRolelist);
  // 获取当前用户的下级权限
  router.get('/getRoles', controller.role.getAllRoles);
};
