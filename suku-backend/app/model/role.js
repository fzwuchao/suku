'use strict';

// 角色表对象
const moment = require('moment');
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
    guardName: {
      type: STRING(30),
      field: 'guard_name',
      comment: '',
    },
    level: {
      type: TINYINT(1),
      comment: '角色等级',
    },
    displayName: {
      type: STRING(30),
      field: 'display_name',
      allowNull: false,
      comment: '角色中文名',
    },
    createdAt: {
      type: DATE,
      field: 'created_at',
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      field: 'updated_at',
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      comment: '更新时间',
    },
    deletedAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('deletedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'deleted_at',
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    paranoid: true,
    deletedAt: 'deletedAt',
  });

  return Role;
};
