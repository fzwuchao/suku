'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, BIGINT } = app.Sequelize;

  const MessageSend = app.model.define('message_send', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    simId: {
      type: STRING(20),
      field: 'sim_id',
    },
    senderId: {
      type: BIGINT(20), // 发送人id
      field: 'sender_id',
    },
    sender: {
      type: STRING(30),
    },
    orderNo: {
      type: STRING(30),
      field: 'order_no',
      comment: '发送订单号',
    },
    retmesg: {
      type: STRING(100),
      comment: '接口返回描述',
    },
    content: {
      type: STRING(100), // '账户名'
    },

    gwid: {
      type: STRING(100),
      comment: 'MAS请求消息流水号',
    },
    retcode: {
      type: STRING(2),
      comment: '接口返回码 接口返回码：00：成功 01：失败 02：接收方号码为空 03：接收方号码错误 04：短信内容为空 05：鉴权ID 为空 06：鉴权失败',
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

  return MessageSend;
};
