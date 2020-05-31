'use strict';

const BaseController = require('../core/base_controller');

class CaptchaController extends BaseController {
  // 获取验证码
  async getCaptcha() {
    // const { Role, Permission, RolePermissionMap } = this.app.model;
    // Role.belongsToMany(Permission, {
    //   through: RolePermissionMap,
    //   // foreignKey: 'role_id',
    // });
    // Permission.belongsToMany(Role, {
    //   through: RolePermissionMap,
    //   // foreignKey: 'permission_id',
    // });
    // const allRoles = await Role.findAll({
    //   include: Permission,
    // });
    // this.ctx.logger.info(allRoles);

    const { ctx } = this;
    const { response, session, service } = ctx;
    const captcha = await service.captcha.getCaptcha();
    // 验证码放到session中
    session.captcha = captcha.text;
    ctx.logger.info('【验证码】:', session.captcha);
    response.type = 'image/svg+xml';
    this.success(captcha.data, '获取验证码成功');
  }

}
module.exports = CaptchaController;
