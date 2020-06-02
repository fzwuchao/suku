'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE, CHAR, DECIMAL, BIGINT } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    pid: INTEGER(20),
    username: {
      type: STRING(30), // '账户名'
      allowNull: false,
      unique: true,
    },
    password: STRING(100), // '密码',
    phone: CHAR(11), // '手机号码',
    name: {
      type: STRING(30), // '用户名'
      allowNull: false,
    },
    email: STRING(30), // '邮箱',
    mchId: {
      type: STRING(30), // '商户号',
      field: 'mch_id',
    },
    rate: DECIMAL(4, 2), // '分成率',
    openMsg: {
      type: STRING(200),
      field: 'open_msg',
    },
    floatPrice: {
      type: DECIMAL(10, 3),
      field: 'float_price',
    },
    uuid: STRING(30),
    roleId: {
      type: INTEGER(20), // '角色id',
      field: 'role_id',
    },
    createdAt: {
      type: DATE, // '创建时间',
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'created_at',
    },
    updatedAt: {
      type: DATE, // '更新时间',
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      field: 'updated_at',
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
};
