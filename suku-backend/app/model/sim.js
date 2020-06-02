
'use strict';

// sim卡
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, TINYINT, DECIMAL, BIGINT } = app.Sequelize;

  const Sim = app.model.define('sim', {
    simId: {
      type: STRING(20),
      primaryKey: true,
      field: 'sim_id',
      comment: 'sim卡号',
    },
    iccid: STRING(50),
    activeTime: {
      type: DATE,
      get() {
        return moment(this.getDataValue('activeTime')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'active_time',
      comment: '激活时间',
    },
    overdueTime: {
      type: DATE,
      get() {
        return moment(this.getDataValue('overdueTime')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'overdue_time',
      comment: '过期时间',
    },
    username: {
      type: STRING(30),
      comment: '账户名',
    },
    simType: {
      type: TINYINT(1),
      field: 'sim_type',
      comment: '类型: A-被叫卡, B-主叫卡',
    },
    netStatus: {
      type: TINYINT(2),
      field: 'net_status',
      comment: '状态: 1-未启用, 2-正常, 3-停机, 4-过期, 5-注销, 6-欠费, 7-手动复机',
    },
    monthSumFlow: {
      type: BIGINT(20),
      field: 'month_sum_flow',
      comment: '总流量',
    },
    monthSumUnit: {
      type: STRING(10),
      field: 'month_sum_flow_unit',
      comment: '总流量单位',
    },
    overlapFlow: {
      type: BIGINT(10),
      field: 'overlap_flow',
      comment: '叠加流量',
    },
    overlapFlowUnit: {
      type: STRING(10),
      field: 'overlap_flow_unit',
      comment: '叠加流量单位',
    },
    renewPrice: {
      type: DECIMAL(10, 3),
      field: 'renew_price',
      comment: '续费价格',
    },
    officeRenewPrice: {
      type: DECIMAL(10, 3),
      field: 'office_renew_price',
      comment: '',
    },
    renewAddPrice: {
      type: DECIMAL(10, 3),
      field: 'renew_add_price',
      comment: '',
    },
    menuFlow: {
      type: BIGINT(10),
      field: 'menu_flow',
      comment: '套餐流量',
    },
    menuFlowUnit: {
      type: STRING(10),
      field: 'menu_flow_unit',
      comment: '套餐流量单位',
    },
    activeMenuId: {
      type: STRING(100),
      field: 'active_menu_id',
      comment: '激活套餐id',
    },
    activeMenuPackIds: {
      type: STRING(100),
      field: 'active_menu_pack_ids',
      comment: '激活套餐包ids, 格式: 1,2,3',
    },
    otherMenuIds: {
      type: STRING(100),
      field: 'other_menu_ids',
      comment: '其它套餐ids, 格式: 1,2,3',
    },
    otherMenuPackIds: {
      type: STRING(100),
      field: 'other_menu_pack_ids',
      comment: '其它套餐包ids, 格式: 1,2,3',
    },
    monthUsedFlow: {
      type: BIGINT(10),
      field: 'month_used_flow',
      comment: '已用流量',
    },
    monthUsedFlowUnit: {
      type: STRING(10),
      field: 'month_used_flow_unit',
      comment: '已用流量单位',
    },
    shengyuFlow: {
      type: BIGINT(10),
      field: 'shengyu_flow',
      comment: '剩余流量',
    },
    shengyuFlowUnit: {
      type: STRING(10),
      field: 'shengyu_flow_unit',
      comment: '剩余流量单位',
    },
    voiceFlow: {
      type: BIGINT(10),
      field: 'voice_flow',
      comment: '总语音',
    },
    voiceFlowUnit: {
      type: STRING(10),
      field: 'voice_flow_unit',
      comment: '总语音单位',
    },
    voiceStatus: {
      type: TINYINT(1),
      field: 'voice_status',
      comment: '语音状态',
    },
    shengyuVoice: {
      type: BIGINT(10),
      field: 'shengyu_voice',
      comment: '剩余语音',
    },
    shengyuVoiceUnit: {
      type: STRING(10),
      field: 'shengyu_voice_unit',
      comment: '剩余语音单位',
    },
    cardStatus: {
      type: TINYINT(1),
      field: 'card_status',
      comment: '平台状态',
    },
    openStatus: {
      type: TINYINT(1),
      field: 'open_status',
      comment: '开关机',
    },
    imei: STRING(50),
    isActive: {
      type: TINYINT(1),
      field: 'is_active',
      comment: '',
    },
    money: {
      type: DECIMAL(10, 3),
      comment: '',
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
