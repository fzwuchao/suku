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
    pname: {
      type: STRING(30),
    },
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
      unique: true,
    },
    email: STRING(30), // '邮箱',
    mchId: {
      type: STRING(30), // '商户号',
      field: 'mch_id',
    },
    rate: DECIMAL(4, 2), // '分成率',
    openMsg: {
      type: INTEGER(1),
      field: 'open_msg',
      comment: '是否开启短信。1：开启0:关闭',
    },
    autoTransfer: {
      type: INTEGER(1),
      field: 'auto_transfer',
      comment: '是否开启短信。1：开启0:关闭',
    },
    floatPrice: {
      type: DECIMAL(10, 3),
      field: 'float_price',

    },
    uuid: STRING(50),
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
    deletedAt: {
      type: DATE,
      get() {
        return moment(this.getDataValue('deletedAt')).format('YYYY-MM-DD HH:mm:ss');
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

  User.associate = function() {
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.User.belongsTo(app.model.Role, { foreignKey: 'roleId', targetKey: 'id' });
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.User.belongsTo(app.model.User, { foreignKey: 'pid', targetKey: 'id' });

  };

  return User;
};
