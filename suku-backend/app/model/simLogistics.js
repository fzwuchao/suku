'use strict';

// 用户表对象
const moment = require('moment');
module.exports = app => {
  const { STRING, DATE, BIGINT } = app.Sequelize;

  const SimLogistics = app.model.define('sim_logistics', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    flowNo: {
      type: STRING(50),
      field: 'flow_no', // sim卡流水号
    },
    sender: {
      type: STRING(30), // 发卡人
    },
    senderId: {
      type: BIGINT(20),
      field: 'sender_id', // 发卡人id
    },
    receiver: {
      type: STRING(30), // 收卡人
    },
    receiverId: {
      type: BIGINT(20),
      field: 'receiver_id', // 收卡人id
    },
    total: {
      type: BIGINT(11), // 发卡数量
    },
    logisticsNo: {
      type: STRING(50), // 物流单号
      field: 'logistics_no',
    },
    phone: {
      type: STRING(15), // 联系电话
    },
    address: {
      type: STRING(100), // 收卡地址
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

  /*   onlinkPlatform.associate = function() {
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.onlinkPlatform.belongsTo(app.model.Role, { foreignKey: 'roleId', targetKey: 'id' });
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.onlinkPlatform.belongsTo(app.model.User, { foreignKey: 'pid', targetKey: 'id' });

  }; */

  return SimLogistics;
};
