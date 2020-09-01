
'use strict';

// 提现记录表
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, TINYINT, DECIMAL, BIGINT } = app.Sequelize;
  const SimOrder = app.model.define('withdrawal_record', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
      comment: '提现id',
    },
    uid: {
      type: BIGINT(20),
      allowNull: false,
      comment: '用户id',
    },
    uname: {
      type: STRING(30),
      allowNull: false,
      comment: '用户名',
    },
    amount: {
      type: DECIMAL(10, 3),
      defaultValue: 0,
      comment: '提现金额',
    },
    accId: {
      type: BIGINT(20),
      field: 'acc_id',
      comment: '账户id',
    },
    account: {
      type: STRING(30),
      comment: '账户号',
    },
    aliasName: {
      type: STRING(45),
      field: 'alias_name',
      comment: '别名',
    },
    accName: {
      type: STRING(20),
      field: 'acc_name',
      comment: '账户名',
    },
    accAddr: {
      type: STRING(100),
      field: 'acc_addr',
      comment: '开户行',
    },
    status: {
      type: TINYINT(2),
      defaultValue: 1,
      comment: '提现状态: 1-未处理, 2-已处理',
    },
    createdAt: {
      type: DATE,
      get() {
        return this.getDataValue('createdAt') ? moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      field: 'created_at',
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      get() {
        return this.getDataValue('updatedAt') ? moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      field: 'updated_at',
      comment: '更新时间',
    },
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  return SimOrder;
};
