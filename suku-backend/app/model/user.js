'use strict';

// 用户表对象

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
    password: STRING(30), // '密码',
    phone: CHAR(11), // '手机号码',
    name: {
      type: STRING(30), // '用户名'
      allowNull: false,
    },
    email: STRING(30), // '邮箱',
    mch_id: STRING(30), // '商户号',
    rate: DECIMAL(4, 2), // '分成率',
    open_msg: STRING(200),
    float_price: DECIMAL(10, 3),
    uuid: STRING(30),
    role_id: INTEGER(20), // '角色id',
    created_at: DATE, // '创建时间',
    updated_at: DATE, // '更新时间',
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
};
