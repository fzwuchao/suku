
'use strict';

// 套餐表
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, TINYINT, DECIMAL, BIGINT } = app.Sequelize;

  const SimCombo = app.model.define('sim_combo', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      comment: '主键',
    },
    name: {
      type: STRING(30),
      comment: '套餐名称',
    },
    comboType: {
      type: TINYINT(2),
      field: 'combo_type',
      comment: '类型: 1-激活套餐，2-叠加套餐，3-特惠套餐',
    },
    belongsToSimType: {
      type: STRING(10),
      field: 'belongs_to_sim_type',
      comment: '所属sim卡的类型: 格式如: A,B',
    },
    monthSumFlowThreshold: {
      type: DECIMAL(10, 3),
      field: 'month_sum_flow_threshold',
      comment: '当月流量阈',
    },
    monthSumFlowThresholdUnit: {
      type: STRING(10),
      field: 'month_sum_flow_threshold_unit',
      comment: '当月流量阈的单位',
    },
    monthRent: {
      type: DECIMAL(10, 3),
      field: 'month_rent',
      comment: '月租',
    },
    renewPrice: {
      type: DECIMAL(10, 3),
      field: 'renew_price',
      comment: '续费价格',
    },
    monthVoiceDurationThreshold: {
      type: DECIMAL(10, 3),
      field: 'month_voice_duration_threshold',
      comment: '当月语音时长阈',
    },
    monthVoiceDurationThresholdUnit: {
      type: STRING(10),
      field: 'month_voice_duration_threshold_unit',
      comment: '当月语音时长阈的单位',
    },
    months: {
      type: TINYINT,
      comment: '月份长度',
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

  return SimCombo;
};
