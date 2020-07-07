
'use strict';

// sim卡
const moment = require('moment');
const hooksName = [
  'afterBulkCreate',
  'afterBulkDestroy',
  'afterBulkUpdate',
  'afterCreate',
  'afterDestroy',
  'afterUpdate',
  'afterSave',
];
module.exports = app => {
  const { STRING, DATE, TINYINT, DECIMAL, BIGINT } = app.Sequelize;
  const delRedisCache = async () => {
    const ctx = app.createAnonymousContext();
    await ctx.service.redisCacheService.batchDelKey('SimOrder*');
  };
  const hooks = {};
  hooksName.forEach(name => {
    hooks[name] = () => {
      delRedisCache();
    };
  });
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
      comment: '卡号',
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
    hooks,
  });

  return SimOrder;
};
