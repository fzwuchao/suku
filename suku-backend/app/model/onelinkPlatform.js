'use strict';

// 用户表对象
const moment = require('moment');
const hooksName = [
  'afterBulkCreate',
  'afterBulkDestroy',
  'afterBulkUpdate',
  'afterCreate',
  'afterDestroy',
  'afterUpdate',
  'afterSave',
];
module.exports = app => {
  const { STRING, INTEGER, DATE, BIGINT } = app.Sequelize;
  const delRedisCache = async () => {
    const ctx = app.createAnonymousContext();
    await ctx.service.redisCacheService.batchDelKey('suku_onelink_info_*');
  };
  const hooks = {};
  hooksName.forEach(name => {
    hooks[name] = () => {
      delRedisCache();
    };
  });
  const OnelinkPlatform = app.model.define('onlink_platform', {
    id: {
      type: BIGINT(20),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(30), // '平台名称'
      allowNull: false,
    },
    appId: {
      type: STRING(100), // 'appId',
      field: 'app_id',
    },
    secretKey: {
      type: STRING(100), // '密码',
      field: 'secret_key',
    },
    apiHost: {
      type: STRING(100), // 'api访问地址',
      field: 'api_host',
    },
    loginName: {
      type: STRING(100), // 'api访问地址',
      field: 'login_name',
    },
    loginPws: {
      type: STRING(100), // 'api访问地址',
      field: 'login_pws',
    },
    apiVersion: {
      type: STRING(30), // 'api的版本',
      field: 'api_version',
    },
    nameKey: {
      type: STRING(50), // 'redis存储Kye',
      field: 'name_key',
      allowNull: false,
      unique: true,
    },
    status: {
      type: INTEGER(1),
      field: 'status',
      comment: '是否开启平台配置。1：开启，0:关闭',
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
    hooks,
  });

  /*   onlinkPlatform.associate = function() {
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.onlinkPlatform.belongsTo(app.model.Role, { foreignKey: 'roleId', targetKey: 'id' });
    // 与Classes存在多对一关系，所以使用belongsTo()
    app.model.onlinkPlatform.belongsTo(app.model.User, { foreignKey: 'pid', targetKey: 'id' });

  }; */

  return OnelinkPlatform;
};
