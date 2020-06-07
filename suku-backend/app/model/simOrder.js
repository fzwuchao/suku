
'use strict';

// sim卡
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, TINYINT, DECIMAL, BIGINT } = app.Sequelize;

  const SimOrder = app.model.define('sim_order', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      comment: '主键',
    },
    orderId: {
      type: STRING(50),
      field: 'order_id',
      comment: '订单号',
    },
    simId: {
      type: BIGINT(20),
      field: 'sim_id',
      comment: '订单号',
    },
    uname: {
      type: STRING(30),
      comment: '用户名',
    },
    uid: {
      type: BIGINT(20),
      comment: '用户ID',
    },
    cpname: {
      type: STRING(30),
      comment: '套餐包名',
    },
    cpid: {
      type: BIGINT(20),
      comment: '套餐包id',
    },
    cname: {
      type: STRING(30),
      comment: '套餐名',
    },
    cid: {
      type: BIGINT(20),
      comment: '套餐id',
    },
    dealAmount: {
      type: DECIMAL(10, 3),
      field: 'deal_amount',
      comment: '交易金额',
    },
    renewIncrAmount: {
      type: DECIMAL(10, 3),
      field: 'renew_incr_amount',
      comment: '续增金额',
    },
    orderStatus: {
      type: TINYINT(2),
      field: 'order_status',
      comment: '订单状态，1:未支付，2:成功 ，0:失败',
    },
    orderType: {
      type: TINYINT(2),
      field: 'order_type',
      comment: '订单类型：1:激活订单,2:叠加订单，3:特惠订单,4:续费订单，5:积分订单',
    },
    wxSerialNum: {
      type: STRING(30),
      field: 'wx_serial_num',
      comment: '微信流水号',
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return SimOrder;
};
