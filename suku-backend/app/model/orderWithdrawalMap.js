
'use strict';

// 订单提现关联表
const moment = require('moment');
module.exports = app => {
  const { DATE, BIGINT } = app.Sequelize;
  const SimOrder = app.model.define('order_withdrawal_map', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      comment: '主键',
    },
    orderId: {
      type: BIGINT(20),
      field: 'order_id',
      allowNull: false,
      comment: '订单id',
    },
    withdrawalId: {
      type: BIGINT(20),
      field: 'withdrawal_id',
      allowNull: false,
      comment: '提现id',
    },
    uid: {
      type: BIGINT(20),
      field: 'uid',
      allowNull: false,
      comment: '用户id',
    },
    createdAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'created_at',
      comment: '创建时间',
    },
    updatedAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
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
