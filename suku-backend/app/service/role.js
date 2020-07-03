'use strict';

// const uuid = require('uuid');
// const path = require('path');
const _ = require('lodash');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class RoleService extends BaseService {
  async getRoleInfo(id) {
    const [ role ] = await this.app.model.Role.findAll({
      where: {
        id,
      },
    });

    return role;
  }

  async getRolesPage(level, pageSize, pageNum) {

    const result = await this.findAndCountAll('Role', pageSize, pageNum, { where: { level: {
      [this.getOp().gte]: level,
    } } });
    return result;
  }

  async getRoles(level) {
    const result = await this.app.model.Role.findAll({ where: { level: {
      [this.getOp().gte]: level,
    } } });
    return result;
  }

  async createRole(role, option) {
    return await this.app.model.Role.create({ ...role }, option);
  }

  async isRepeatedName(name, displayName, id) {
    const Op = this.getOp();
    const condition = {};
    if (!_.isNil(id)) {
      condition.id = {
        [Op.ne]: id,
      };
    }
    const result = await this.app.model.Role.findOne({
      where: {
        [Op.or]: [
          { name },
          { displayName },
        ],
        ...condition,
      },
    });

    return result;
  }

  async update(data, options) {
    await this.app.model.Role.update(data, options);
  }

  async del(id, options) {
    await this.app.model.Role.destroy({
      where: {
        id,
      },
      ...options,
    });
  }

  async delByRoleId(id) {
    const t = await this.getTransaction();
    const transaction = { transaction: t };
    try {
      await this.del(id, transaction);
      await this.ctx.service.rolePermissionMap.deleteByRoleId({
        where: { roleId: id },
        ...transaction,
      });
      await t.commit();
      return true;
    } catch (error) {
      this.ctx.logger.error(error);
      await t.rollback();
      return false;
    }
  }

  async getRoleTypeById(id) {
    const role = await this.ctx.model.Role.findByPk(id);
    return role ? role.roleType : null;
  }
}

module.exports = RoleService;
