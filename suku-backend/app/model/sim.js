
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
    uid: {
      type: BIGINT(20),
      field: 'uid',
      comment: '用户id',
    },
    uname: {
      type: STRING(30),
      comment: '用户名',
    },
    simType: {
      type: CHAR(1),
      field: 'sim_type',
      comment: '类型: A-被叫卡, B-主叫卡',
    },
    activeComboId: {
      type: BIGINT(10),
      field: 'active_combo_id',
      comment: '激活套餐id',
    },
    activeComboName: {
      type: STRING(30),
      field: 'active_combo_name',
      comment: '激活套餐名',
    },
    monthRent: {
      type: DECIMAL(10, 3),
      field: 'month_rent',
      comment: '月租',
    },
    otherComboIds: {
      type: STRING(100),
      field: 'other_combo_ids',
      comment: '其它套餐ids, 格式: 1,2,3',
    },
    isActive: {
      type: TINYINT(1),
      field: 'is_active',
      defaultValue: 0,
      comment: '是否激活: 1-激活, 0-未激活',
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
        return this.getDataValue('overdueTime') ? moment(this.getDataValue('overdueTime')).format('YYYY-MM-DD') : null;
      },
      field: 'overdue_time',
      comment: '过期时间',
    },
    monthSumFlowThreshold: {
      type: DECIMAL(10, 3),
      field: 'month_sum_flow_threshold',
      comment: '当月流量阈(M)',
    },
    monthOverlapFlow: {
      type: DECIMAL(10, 3),
      field: 'month_overlap_flow',
      comment: '当月叠加流量(M)',
    },
    monthShengyuFlow: {
      type: DECIMAL(10, 3),
      field: 'month_shengyu_flow',
      comment: '当月剩余流量(M)',
    },
    monthUsedFlow: {
      type: DECIMAL(10, 3),
      field: 'month_used_flow',
      comment: '已用流量(M)',
    },
    monthVoiceDurationThreshold: {
      type: DECIMAL(10, 3),
      field: 'month_voice_duration_threshold',
      comment: '当月语间时长阈(分)',
    },
    monthShengyuVoiceDuration: {
      type: DECIMAL(10, 3),
      field: 'month_shengyu_voice_duration',
      comment: '当月剩余语音时长(分)',
    },
    monthOverlapVoiceDuration: {
      type: DECIMAL(10, 3),
      field: 'month_overlap_voice_duration',
      comment: '当月叠加语单时长(分)',
    },
    monthUsedVoiceDuration: {
      type: DECIMAL(10, 3),
      field: 'month_used_voice_duration',
      comment: '已用语单时长(分)',
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
      defaultValue: 2,
      comment: '语音服务关停状态: 1-开, 2-关',
    },
    flowServStatus: {
      type: TINYINT(1),
      field: 'flow_serv_status',
      defaultValue: 2,
      comment: '流量服务关停状态: 1-开, 2-关',
    },
    msgServStatus: {
      type: TINYINT(1),
      field: 'msg_serv_status',
      defaultValue: 2,
      comment: '流量服务关停状态: 1-开, 2-关',
    },
    netStatus: {
      type: TINYINT(2),
      field: 'net_status',
      comment: '状态: 1-未启用, 2-正常, 3-停机, 4-过期, 5-注销, 6-欠费, 7-手动复机',
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
    cardStatus: {
      type: STRING(2),
      field: 'card_status',
      defaultValue: '1',
      comment: 'onelink平台状态: 1：待激活, 2：已激活, 4：停机, 6：可测试, 7：库存, 8：预销户',
    },
    openStatus: {
      type: TINYINT(1),
      field: 'open_status',
      defaultValue: 0,
      comment: '开关机状态: 0-关机, 1-开机',
    },
    privateMoney: {
      type: DECIMAL(10, 3),
      field: 'private_money',
      comment: '经销商个人的加价，不参与分成',
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
