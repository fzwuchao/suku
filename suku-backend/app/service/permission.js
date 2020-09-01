'use strict';

/**
 * 权限
 */
const BaseService = require('../core/baseService');

class PermissionService extends BaseService {
  // 获取权限
  async getPermission(roleId) {
    let permissions = [];
    const { Role, Permission, RolePermissionMap } = this.app.model;
    // Role.belongsToMany(Permission, {
    //   through: RolePermissionMap,
    //   foreignKey: 'roleId',
    // });
    // Permission.belongsToMany(Role, {
    //   through: RolePermissionMap,
    //   foreignKey: 'permissionId',
    // });
    const [role] = await Role.findAll({
      where: {
        id: roleId,
      },
      order: [[Permission, 'menuOrder', 'ASC']],
      include: {
        model: Permission,
        through: {
          attributes: [],
        },
      },
    });

    const map = {};
    const allPermissionMap = {};
    // eslint-disable-next-line no-unused-vars
    let checkedAndHalfKeys = {};
    if (role) {
      permissions = this.getPermissionTree(role.permissions, map);
      await this.getAllPermission(allPermissionMap);
      checkedAndHalfKeys = this.getCheckedAndHalfKeys(permissions, allPermissionMap);
    }

    // this.ctx.logger.debug(permissions);
    return { permissions, checkedAndHalfKeys };
  }

  async getAllPermission(map) {
    const permissionList = await this.app.model.Permission.findAll();
    const permissions = this.getPermissionTree(permissionList, map);
    return permissions;
  }

  getPermissionTree(permissionList, map = {}) {
    // map格式：{ id: Permission }
    const permissions = [];
    permissionList.forEach(permission => {
      map[permission.id] = permission;

      // 放入一级菜单
      if (permission.parentId === 0) {
        permissions.push(permission);
      }
    });

    permissionList.forEach(permission => {
      const parent = map[permission.parentId];
      if (parent) {
        !parent.subMenuList && (parent.subMenuList = []);
        parent.subMenuList.push(permission);
      } else {
        // 没有子菜单的一级菜单，子菜单列表为空数组
        permission.subMenuList = [];
      }
    });
    return permissions;
  }


  getCheckedAndHalfKeys(permissionsTree, allPermissionMap) {
    const halfKeys = [];
    const checkedKeys = [];
    const getSubState = parent => {
      const subMenuList = parent.subMenuList || [];

      const checkedMenu = subMenuList.filter(menu => {
        if (menu.subMenuList && menu.subMenuList.length > 0) {
          menu.isHalfChecked = getSubState(menu);
        } else {
          menu.isHalfChecked = false;
          checkedKeys.push(menu.id);
        }
        return menu.isHalfChecked === false;
      });
      const isHalfChecked = checkedMenu.length !== allPermissionMap[parent.id].subMenuList.length;

      if (isHalfChecked) {
        halfKeys.push(parent.id);
      } else {
        checkedKeys.push(parent.id);
      }
      return isHalfChecked;
    };

    permissionsTree.forEach(item => {
      if (item.subMenuList) {
        item.isHalfChecked = getSubState(item);
      } else {
        item.isHalfChecked = false;
      }
    });

    return { checkedKeys, halfKeys };
  }


  async save(roleData, permissions) {
    const t = await this.getTransaction();
    const { service } = this.ctx;
    try {
      const role = await service.role.createRole(roleData, { transaction: t });
      const permissionList = permissions.map(item => {
        return {
          permissionId: item,
          roleId: role.id,
        };
      });
      await service.rolePermissionMap.createRolePermMap(permissionList, { transaction: t });
      await t.commit();
      return true;
    } catch (error) {
      this.ctx.logger.error(error);
      await t.rollback();
      return false;
    }
  }

  async update(roleData, roleId, permissions) {
    const t = await this.getTransaction();
    const { service } = this.ctx;
    try {
      await service.role.update(roleData, {
        where: {
          id: roleId,
        },
        transaction: t,
      });
      const permissionList = permissions.map(item => {
        return {
          permissionId: item,
          roleId,
        };
      });
      await service.rolePermissionMap.deleteByRoleId({
        where: {
          roleId,
        },
        transaction: t,
      });
      await service.rolePermissionMap.createRolePermMap(permissionList, { transaction: t });
      await t.commit();
      return true;
    } catch (error) {
      this.ctx.logger.error(error);
      await t.rollback();
      return false;
    }
  }

  async createPermisson(permission, options) {
    return await this.ctx.model.Permission.create({ ...permission }, { ...options });
  }
}

module.exports = PermissionService;
