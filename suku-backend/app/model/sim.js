
'use strict';

// sim卡
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, TINYINT, DECIMAL, CHAR, BIGINT } = app.Sequelize;

  const Sim = app.model.define('sim', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
      comment: '主键',
    },
    simId: {
      type: BIGINT(20),
      field: 'sim_id',
      unique: true,
      comment: 'sim卡号',
    },
    iccid: STRING(50),
    imei: STRING(50),
    userId: {
      type: BIGINT(20),
      field: 'user_id',
      comment: '用户id',
    },
    username: {
      type: STRING(30),
      comment: '用户名',
    },
    simType: {
      type: CHAR(1),
      field: 'sim_type',
      comment: '类型: A-被叫卡, B-主叫卡',
    },
    activeMenuId: {
      type: BIGINT(10),
      field: 'active_menu_id',
      comment: '激活套餐id',
    },
    activeMenuName: {
      type: STRING(30),
      field: 'active_menu_name',
      comment: '激活套餐名',
    },
    otherMenuIds: {
      type: STRING(100),
      field: 'other_menu_ids',
      comment: '其它套餐ids, 格式: 1,2,3',
    },
    isActive: {
      type: TINYINT(1),
      field: 'is_active',
      comment: '是否激活: 1-激活, 2-未激活',
    },
    activeTime: {
      type: DATE,
      get() {
        return this.getDataValue('activeTime') ? moment(this.getDataValue('activeTime')).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      field: 'active_time',
      comment: '激活时间',
    },
    overdueTime: {
      type: DATE,
      get() {
        return this.getDataValue('overdueTime') ? moment(this.getDataValue('overdueTime')).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      field: 'overdue_time',
      comment: '过期时间',
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
    monthOverlapFlow: {
      type: DECIMAL(10, 3),
      field: 'month_overlap_flow',
      comment: '当月叠加流量',
    },
    monthOverlapFlowUnit: {
      type: STRING(10),
      field: 'month_overlap_flow_unit',
      comment: '当月叠加流量单位',
    },
    monthShengyuFlow: {
      type: DECIMAL(10, 3),
      field: 'month_shengyu_flow',
      comment: '当月剩余流量',
    },
    monthShengyuFlowUnit: {
      type: STRING(10),
      field: 'month_shengyu_flow_unit',
      comment: '当月剩余流量单位',
    },
    monthVoiceDurationThreshold: {
      type: DECIMAL(10, 3),
      field: 'month_voice_duration_threshold',
      comment: '当月语间时长阈',
    },
    monthVoiceDurationThresholdUnit: {
      type: STRING(10),
      field: 'month_voice_duration_threshold_unit',
      comment: '当月语音时长阈的单位',
    },
    monthShengyuVoiceDuration: {
      type: DECIMAL(10, 3),
      field: 'month_shengyu_voice_duration',
      comment: '当月剩余语音时长',
    },
    monthShengyuVoiceDurationUnit: {
      type: STRING(10),
      field: 'month_shengyu_voice_duration_unit',
      comment: '当月剩余语音时长单位',
    },
    renewPrice: {
      type: DECIMAL(10, 3),
      field: 'renew_price',
      comment: '续费价格',
    },
    shengyuMoney: {
      type: DECIMAL(10, 3),
      field: 'shengyu_money',
      comment: '剩余金额',
    },
    voiceServStatus: {
      type: TINYINT(1),
      field: 'voice_serv_status',
      comment: '语音服务关停状态: 1-开, 2-关',
    },
    flowServStatus: {
      type: TINYINT(1),
      field: 'flow_serv_status',
      comment: '流量服务关停状态: 1-开, 2-关',
    },
    netStatus: {
      type: TINYINT(2),
      field: 'net_status',
      comment: '状态: 1-未启用, 2-正常, 3-停机, 4-过期, 5-注销, 6-欠费, 7-手动复机',
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

  return Sim;
};