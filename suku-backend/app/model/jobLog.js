'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE, BIGINT } = app.Sequelize;

  const JobLog = app.model.define('job_log', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    params: {
      type: STRING(1500),
    },
    name: {
      type: STRING(80),
    },
    jobStatus: {
      type: STRING(2),
      field: 'job_status',
      comment: '0：待处理 1：处理中 2：处理完成 3：包含有处理失败记录的处理完成 4：处理失败',
    },
    result: {
      type: STRING(3500),
      field: 'result',
    },
    onelinkId: {
      type: BIGINT(20),
      field: 'onelink_id',
    },
    url: STRING(100), // '邮箱',
    isExec: {
      type: INTEGER(1),
      field: 'is_exec',
      comment: '是否被重新执行过：1，执行过；0：未执行过',
    },
    errorSim: {
      type: STRING(1500),
      field: 'error_sim',
    },
    jobId: {
      type: STRING(30),
      field: 'job_id',
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
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  JobLog.associate = function() {
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.JobLog.belongsTo(app.model.OnelinkPlatform, { foreignKey: 'onelinkId', targetKey: 'id' });

  };

  return JobLog;
};
