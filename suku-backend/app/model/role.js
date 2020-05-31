'use strict';

// 角色表对象

module.exports = app => {
  const { STRING, DATE, BIGINT, TINYINT } = app.Sequelize;

  const Role = app.model.define('role', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    name: {
      type: STRING(30),
      allowNull: false,
      comment: '角色英文名',
    },
    guard_name: {
      type: STRING(30),
      comment: '',
    },
    level: {
      type: TINYINT(1),
      comment: '角色等级',
    },
    display_name: {
      type: STRING(30),
      allowNull: false,
      comment: '角色中文名',
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
  });

  return Role;
};
