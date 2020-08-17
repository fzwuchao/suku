'use strict';
const { payApi } = require('./extend/wechat')();
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
  router.post('/logout', controller.login.logout);

  // 获取验证码
  router.get('/getCaptcha', controller.captcha.getCaptcha);

  // 导入
  // router.post('/import', controller.sheet.importFile);

  // 导出
  // router.post('/export', controller.user.exportFile);

  // 获取角色的权限
  router.get('/permission/rolePermission', controller.permission.getPermission);
  // 获取角色的权限
  router.get('/permission/permissionByRoleId', controller.permission.getPermissionByRoleId);
  // 获取所有的权限树
  router.get('/permission/allPermission', controller.permission.getAllPermission);
  // 编辑和新增
  router.post('/permission/save', controller.permission.save);
  // 删除
  router.delete('/role/delete', controller.role.delete);
  // 获取角色类型
  router.get('/role/roleType', controller.role.getRoleType);

  // 查询sim卡
  router.post('/sim/search', controller.sim.search);
  // 导入物联卡
  // router.post('/sim/importSims', controller.sim.importSims);
  router.post('/sim/importSims', controller.sim.importSimsWithHeadField);
  // 上传文件
  router.post('/sheet/upload', controller.sheet.uploadFile);
  // 根据simId获取sim信息
  router.get('/sim/getSim', controller.sim.getSim);
  // 导出sim卡
  router.post('/sim/export', controller.sim.exportExcel);
  // 同步更新
  router.get('/sim/syncUpdate', controller.sim.syncUpdate);
  // 更新
  router.post('/sim/update', controller.sim.update);
  // 批量更新
  router.post('/sim/batchUpdate', controller.sim.batchUpdate);
  // 更换套餐
  router.post('/sim/batchUpdateSimCombo', controller.sim.changeComboBySimNumOrSimRange);
  // 转让
  router.post('/sim/batchUpdateSimUser', controller.sim.changeUserBySimNumOrSimRange);
  // 
  router.post('/sim/batchUpdateActiveCombo', controller.sim.changeActiveComboBySimNumOrSimRange);
  // 导入sim卡（迁移）
  router.post('/sim/transfer', controller.sim.importSimsWithHeadFieldForTransfer);
  // 迁移同步
  router.get('/sim/migrationSyncUpdate', controller.sim.migrationSyncUpdate);
  // 手动触发设置阀值
  router.get('/sim/configLimtValue', controller.sim.configLimtValue);
  // 手动触发单卡设置阀值
  router.get('/sim/configLimtValueBySimId', controller.sim.configLimtValueBySimId);
  // 获取iccid
  router.get('/sim/iccidSyncUpdate', controller.sim.iccidSyncUpdate);
  
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
  // 套餐列表
  router.get('/simCombo/comboList', controller.simCombo.getNonActiveComboBySimType);

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
  // 根据昵称获取用户
  router.get('/user/getUserByName', controller.user.getUserByName);
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
  // 更新密码
  router.post('/user/updatePwd', controller.user.updatePwd);

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
  // 获取所有开启onelink的token
  router.get('/onelink/getToken', controller.onelinkPlatform.getToken);


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
  // 同步白名单状态
  router.get('/writeList/queryWriteListStatus', controller.writeList.queryWriteListStatus);


  // 获取onelink错误日志
  router.get('/errorLog/getErrorLogs', controller.errorLog.getErrorLogs);
  // 处理onelink错误日志
  router.post('/errorLog/deal', controller.errorLog.deal);

  // 获取onelink Job
  router.get('/jobLog/getJobLogs', controller.jobLog.getJobLogs);
  // 处理onelink Job
  router.post('/jobLog/deal', controller.jobLog.deal);

  // 用于模拟发送短信，之后可删除
  router.post('/testMsgSend', controller.testMsgSend.testMsgSend);
  router.post('/testMsgSendUpgoing', controller.testMsgSend.testMsgSendUpgoing);
  router.get('/tMsgSend', controller.testMsgSend.tMsgSend);
  router.get('/tMsgSendUpgoing', controller.testMsgSend.tMsgSendUpgoing);

  router.get('/wechat/getOpenId', controller.wechat.getOpenId);
  router.post('/wechat/payBack', payApi.middleware('pay'), controller.wechat.payBack);
  // router.post('/wechat/payBack', controller.wechat.payBack);

  // 提现
  router.get('/withdrawal/getWithdrawalOrderList', controller.simOrder.getWithdrawalOrderList);

};
