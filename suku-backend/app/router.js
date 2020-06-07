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

  // 查询套餐
  router.get('/simCombo/search', controller.simCombo.search);

  // 套餐包
  router.get('/comboPack/search', controller.comboPack.search);

  // 获取用户列表
  router.get('/user/searchUser', controller.user.getUserlist);
  // 根据用户名获取用户
  router.get('/user/getUserByUsername', controller.user.getUserByUsername);
  // 根据用户Id获取用户
  router.get('/user/getUserById', controller.user.getUserById);
  // 保存或者更新用户
  router.post('/user/save', controller.user.save);
  // 批量开启短讯
  router.post('/user/updateOpenmsg', controller.user.updateOpenmsg);
  // 启用停用自动转账
  router.post('/user/updateAutoTransfer', controller.user.updateAutoTransfer);
  // 获取所有用户作为查询条件
  router.get('/user/getSelectUsers', controller.user.getSelectUsers);


  // 获取onelink配置列表
  router.get('/onelink/searchOnelink', controller.onelinkPlatform.getOnelinklist);
  // 根据nameKey获取配置
  router.get('/onelink/getOnelinkByNameKey', controller.onelinkPlatform.getOnelinkByNameKey);
  // 根据ID获取配置
  router.get('/onelink/getOnelinkById', controller.onelinkPlatform.getOnelinkById);
  // 保存或者更新onelink配置
  router.post('/onelink/save', controller.onelinkPlatform.save);
  // 批量开启/关闭平台
  router.post('/onelink/updateStatus', controller.onelinkPlatform.updateStatus);


  // 获取sim流水
  router.get('/simLogistics/getSimLogisticslist', controller.simLogistics.getSimLogisticslist);
  // 根据ID获取SIM流水
  router.get('/simLogistics/getSimLogisticsById', controller.simLogistics.getSimLogisticsById);
  // 保存或者更新SIM流水
  router.post('/simLogistics/save', controller.simLogistics.save);

  // 获取sim流水
  router.get('/messageSend/getMessageSendlist', controller.messageSend.getMessageSendlist);
  // 保存或者更新SIM流水
  router.post('/messageSend/save', controller.messageSend.save);

  // 获取权限列表
  router.get('/role/searchRole', controller.role.getRolelist);
  // 获取当前用户的下级权限
  router.get('/role/getRoles', controller.role.getAllRoles);

  // 查询订单
  router.get('/simOrder/getSimOrderlist', controller.simOrder.getSimOrderlist);
};
