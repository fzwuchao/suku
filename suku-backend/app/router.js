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

  // 查询sim卡
  router.get('/sim/search', controller.sim.search);
  // 导入物联卡
  // router.post('/sim/importSims', controller.sim.importSims);
  router.post('/sim/importSims', controller.sim.importSimsWithHeadField);
  // 上传文件
  router.post('/sheet/upload', controller.sheet.uploadFile);
  // 根据simId获取sim信息
  router.get('/sim/getSim', controller.sim.getSim);
  // 导出sim卡
  router.get('/sim/export', controller.sim.exportExcel);
  // 同步更新
  router.get('/sim/syncUpdate', controller.sim.syncUpdate);

  // 查询套餐
  router.get('/simCombo/search', controller.simCombo.search);
  // 通过id,查询套餐
  router.get('/simCombo/getSimComboById', controller.simCombo.getSimComboById);
  // 通过comboType,查询套餐
  router.get('/simCombo/getSimComboByComboType', controller.simCombo.getSimComboByComboType);
  // 创建套餐
  router.post('/simCombo/save', controller.simCombo.save);
  // 通过ids,查询套餐
  router.post('/simCombo/getSimComboByIds', controller.simCombo.getSimComboByIds);


  // 套餐包
  router.get('/comboPack/search', controller.comboPack.search);
  // 保存
  router.post('/comboPack/save', controller.comboPack.save);
  // 通过id,查询套餐包
  router.get('/comboPack/getComboPackById', controller.comboPack.getComboPackById);

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
  // 获取一级子用户
  router.get('/user/getChildUsers', controller.user.getChildUsers);


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
  // 获取所有开启的onelink配置
  router.get('/onelink/getAllOnelink', controller.onelinkPlatform.getAllOnelink);


  // 获取sim流水
  router.get('/simLogistics/getSimLogisticslist', controller.simLogistics.getSimLogisticslist);
  // 根据ID获取SIM流水
  router.get('/simLogistics/getSimLogisticsById', controller.simLogistics.getSimLogisticsById);
  // 保存或者更新SIM流水
  router.post('/simLogistics/save', controller.simLogistics.save);

  // 短信发送记录
  router.get('/messageSend/getMessageSendlist', controller.messageSend.getMessageSendlist);
  // 新建短信发送记录
  router.post('/messageSend/save', controller.messageSend.save);
  // 短信上行记录
  router.get('/messageUpgoing/getMessageUpgoinglist', controller.messageUpgoing.getMessageUpgoinglist);
  // 短信发送记录
  router.get('/messageSend/getSendlistBySimId', controller.messageSend.getSendlistBySimId);
  // 获取权限列表
  router.get('/role/searchRole', controller.role.getRolelist);
  // 获取当前用户的下级权限
  router.get('/role/getRoles', controller.role.getAllRoles);

  // 查询订单
  router.get('/simOrder/getSimOrderlist', controller.simOrder.getSimOrderlist);
  // 创建订单
  router.post('/simOrder/save', controller.simOrder.save);


  // 查询白名单记录
  router.get('/writeList/getWriteList', controller.writeList.getWriteList);
  // 设置白名单
  router.post('/writeList/save', controller.writeList.save);
  // 根据simId查询
  router.get('/writeList/getWriteListBySimId', controller.writeList.getWriteListBySimId);

};
