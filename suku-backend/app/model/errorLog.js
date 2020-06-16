'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE, BIGINT } = app.Sequelize;

  const ErrorLog = app.model.define('user', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    params: {
      type: STRING(1500),
    },
    status: {
      type: STRING(10),
    },
    message: {
      type: STRING(100),
    },
    url: STRING(100), // '邮箱',
    isExec: {
      type: INTEGER(1),
      field: 'is_exec',
      comment: '是否被重新执行过：1，执行过；0：未执行过',
    },
    source: {
      type: INTEGER(1),
      comment: '产生错误的平台，1:调移动端接口，2:本地平台',
    },
    type: {
      type: INTEGER(1),
      comment: '接口的请求类型：1:query,2:change,3:config,4:operate',
    },
    jobId: {
      type: STRING(10),
      field: 'job_id',
    },
    onelinkId: {
      type: BIGINT(20),
      field: 'onelink_id',
    },
    createdAt: {
      type: DATE, // '创建时间',
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'created_at',
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
  });


  return ErrorLog;
};
