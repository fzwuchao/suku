
'use strict';

// 套餐表
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, DECIMAL, BIGINT, TINYINT } = app.Sequelize;

  const ComboPack = app.model.define('combo_pack', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      comment: '主键',
    },
    name: {
      type: STRING(30),
      comment: '套餐包名称',
    },
    comboType: {
      type: TINYINT(2),
      field: 'combo_type',
      comment: '类型: 1-激活套餐，2-叠加套餐，3-特惠套餐',
    },
    comboId: {
      type: BIGINT(20),
      field: 'combo_id',
      comment: '套餐id',
    },
    money: {
      type: DECIMAL(10, 3),
      comment: '金额',
    },
    awardMoney: {
      type: DECIMAL(10, 3),
      field: 'award_money',
      comment: '赠送金额',
    },
    monthFlow: {
      type: DECIMAL(10, 3),
      field: 'month_flow',
      comment: '当月流量',
    },
    monthVoice: {
      type: DECIMAL(10, 3),
      field: 'month_voice',
      comment: '当月语音时长阈(分)',
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

  ComboPack.associate = () => {
    const { SimCombo, ComboPack } = app.model;
    SimCombo.hasMany(ComboPack, { foreignKey: 'comboId' });
    ComboPack.belongsTo(SimCombo, { as: 'simCombo', foreignKey: 'comboId' });
  };

  return ComboPack;
};
