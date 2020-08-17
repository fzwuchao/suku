'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE, CHAR, BIGINT } = app.Sequelize;

  const WbAccount = app.model.define('wb_account', {
    id: {
      type: BIGINT(10),
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: BIGINT(20),
    },
    account: {
      type: STRING(30), // '账户号',
    },
    acName: {
      type: STRING(20),
      field: 'ac_name',
    },
    aliasName: {
      type: STRING(45),
      field: 'alias_name',
    },
    acAddr: {
      type: STRING(100),
      field: 'ac_addr',
    },
    createdAt: {
      type: DATE, // '创建时间',
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'created_at',
    },
    updatedAt: {
      type: DATE, // '更新时间',
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'updated_at',
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
    paranoid: true,
    deletedAt: 'deletedAt',
  });


  return WbAccount;
};
