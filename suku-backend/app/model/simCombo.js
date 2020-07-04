
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
    monthFlow: {
      type: DECIMAL(10, 3),
      field: 'month_flow',
      comment: '当月流量阈(M)',
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
    monthVoice: {
      type: DECIMAL(10, 3),
      field: 'month_voice',
      comment: '当月语音时长阈(分)',
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
  });

  SimCombo.associate = function() {
    app.model.SimCombo.hasMany(app.model.ComboPack, { foreignKey: 'comboId', as: 'packs' });
    // 与ComboPack存在多对一关系，所以使用belongsTo()
    // app.model.SimCombo.belongsTo(app.model.ComboPack, { foreignKey: 'comboId', targetKey: 'id' });

  };

  return SimCombo;
};
