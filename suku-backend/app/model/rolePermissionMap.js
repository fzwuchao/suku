'use strict';

// 角色权限映射表对象

module.exports = app => {
  const { DATE, BIGINT } = app.Sequelize;

  const RolePermissionMap = app.model.define('role_permission_map', {
    role_id: {
      type: BIGINT(20),
      comment: '角色id',
    },
    permission_id: {
      type: BIGINT(20),
      comment: '权限id',
    },
    created_at: {
      type: DATE,
      comment: '创建时间',
    },
    updated_at: {
      type: DATE,
      comment: '更新时间',
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: [ 'role_id', 'permission_id' ] }],
  });

  // RolePermissionMap.hasMany(app.model.Role, app.model.Permission);
  return RolePermissionMap;
};
