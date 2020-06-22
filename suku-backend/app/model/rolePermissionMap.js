'use strict';

// 角色权限映射表对象

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
      field: 'created_at',
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      field: 'updated_at',
      comment: '更新时间',
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: [ 'role_id', 'permission_id' ] }],
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
