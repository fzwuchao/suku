'use strict';

// 角色权限映射表对象
const moment = require('moment');

module.exports = app => {
  const { DATE, BIGINT } = app.Sequelize;

  const RolePermissionMap = app.model.define('role_permission_map', {
    roleId: {
      type: BIGINT(20),
      field: 'role_id',
      comment: '角色id',
    },
    permissionId: {
      type: BIGINT(20),
      field: 'permission_id',
      comment: '权限id',
    },
    createdAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'created_at',
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'updated_at',
      comment: '更新时间',
    },
    deletedAt: {
      type: DATE,
      get() {
        const deletedAt = this.getDataValue('deletedAt');
        return deletedAt ? moment(deletedAt).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      field: 'deleted_at',
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [{ unique: true, fields: [ 'role_id', 'permission_id' ] }],
    paranoid: true,
    deletedAt: 'deletedAt',
  });

  RolePermissionMap.associate = () => {
    const { Role, Permission } = app.model;
    Role.belongsToMany(Permission, {
      through: RolePermissionMap,
      foreignKey: 'roleId',
    });
    Permission.belongsToMany(Role, {
      through: RolePermissionMap,
      foreignKey: 'permissionId',
    });
  };
  return RolePermissionMap;
};
