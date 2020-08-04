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
      comment: '设置状态。0：失效 1:生效  2:处理中',
    },
    onelinkId: {
      type: BIGINT(20),
      field: 'onelink_id',
      comment: 'onelink平台id',
    },
    onelinkName: {
      type: STRING(30),
      field: 'onelink_name',
      comment: 'onelink平台名称',
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


  return WriteList;
};
