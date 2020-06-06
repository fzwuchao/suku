
'use strict';

// 套餐表
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, DECIMAL, BIGINT } = app.Sequelize;

  const ComboPack = app.model.define('sim_combo', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      comment: '主键',
    },
    name: {
      type: STRING(30),
      comment: '套餐包名称',
    },
    comboId: {
      type: BIGINT(20),
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

  return ComboPack;
};
