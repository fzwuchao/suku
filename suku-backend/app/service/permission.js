'use strict';

/**
 * 权限
 */
const Service = require('egg').Service;

class PermissionService extends Service {
  // 获取权限
  async getPermission(roleId) {
    const permissions = [];
    const { Role, Permission, RolePermissionMap } = this.app.model;
    Role.belongsToMany(Permission, {
      through: RolePermissionMap,
      foreignKey: 'role_id',
    });
    Permission.belongsToMany(Role, {
      through: RolePermissionMap,
      foreignKey: 'permission_id',
    });
    const [ role ] = await Role.findAll({
      where: {
        id: roleId,
      },
      include: Permission,
      through: { attributes: [] },
    });
    const map = {};
    if (role) {
      role.permissions.forEach(permission => {
        map[permission.id] = permission;

        // 放入一级菜单
        if (permission.parentId === 0) {
          permissions.push(permission);
        }
      });

      role.permissions.forEach(permission => {
        const parent = map[permission.parentId];
        if (parent) {
          !parent.subMenuList && (parent.subMenuList = []);
          parent.subMenuList.push(permission);
        }
      });

    }

    // this.ctx.logger.debug(permissions);
    return permissions;
  }

}

module.exports = PermissionService;
