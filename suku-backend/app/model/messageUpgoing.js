'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, BIGINT } = app.Sequelize;

  const MessageUpgoing = app.model.define('message_upgoing', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    simId: {
      type: STRING(20),
      field: 'sim_id',
    },
    uid: {
      type: BIGINT(20),
    },
    uname: {
      type: STRING(30),
    },
    content: {
      type: STRING(100), // '账户名'
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

  return MessageUpgoing;
};
