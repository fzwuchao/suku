
'use strict';

// 开关表
const moment = require('moment');
module.exports = app => {
  const { STRING } = app.Sequelize;

  const OnOff = app.model.define('on_off', {
    code: {
      type: STRING(30),
      primaryKey: true,
      comment: '码键',
    },
    value: {
      type: STRING(30),
      comment: '码值',
    },
    name: {
      type: STRING(30),
      comment: '码键中文名称',
    },
    remark: {
      type: STRING(100),
      comment: '备注',
    },
  }, {
    timestamps: false
  });
  return OnOff;
};
