'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE, CHAR, BIGINT } = app.Sequelize;

  const WriteList = app.model.define('write_list', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: BIGINT(20),
    },
    uname: {
      type: STRING(30),
    },
    phone: CHAR(15), // '手机号码',
    simId: {
      type: BIGINT(20), // '商户号',
      field: 'sim_id',
    },
    status: {
      type: INTEGER(1),
      comment: '是否开启短信。0：成功 非0:失败',
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


  return WriteList;
};
