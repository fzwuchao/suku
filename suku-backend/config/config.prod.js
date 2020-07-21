/* eslint-disable eol-last */
/* eslint-disable array-bracket-spacing */
/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

const MYSQL_PARAMS = {
  HOST: '47.115.75.162', // 'localhost',
  PORT: 3306,
  USER: 'suku', // 'root',
  PASSWORD: 'ZY1305@OULAN', // 'root1234',
  DATABASE: 'suku', // 'youlan_db',
};

const REDIS_PARAMS = {
  HOST: '47.115.75.162',
  PORT: 6379,
  PASSWORD: 'auth',
};

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  // config.keys = appInfo.name + '_1589425408323_5421';
  // add your middleware config here
  // 所有请求都会走checkToken（middleware/checkToken.js)
  // config.middleware = ['checkToken'];
  // config.jwt = {
  //   secret: '123456', // 自定义 token 的加密条件字符串
  // };

  // config.cors = {
  //   origin: '*',
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // };

  // config.mysql = {
  //   // 单数据库信息配置
  //   client: {
  //     // host
  //     host: MYSQL_PARAMS.HOST,
  //     // 端口号
  //     port: MYSQL_PARAMS.PORT,
  //     // 用户名
  //     user: MYSQL_PARAMS.USER,
  //     // 密码
  //     password: MYSQL_PARAMS.PASSWORD,
  //     // 数据库名
  //     database: MYSQL_PARAMS.DATABASE,
  //   },
  //   // 是否加载到 app 上，默认开启
  //   app: true,
  //   // 是否加载到 agent 上，默认关闭
  //   agent: false,
  // };

  // config.sequelize = {
  //   dialect: 'mysql',
  //   // host
  //   host: MYSQL_PARAMS.HOST,
  //   // 端口号
  //   port: MYSQL_PARAMS.PORT,
  //   // 用户名
  //   username: MYSQL_PARAMS.USER,
  //   // 密码
  //   password: MYSQL_PARAMS.PASSWORD,
  //   // 数据库名
  //   database: MYSQL_PARAMS.DATABASE,
  //   timezone: '+08:00',
  //   define: {
  //     freezeTableName: true, // 强制model名与table名保持一致
  //   },
  // };

  config.redis = {
    client: {
      port: REDIS_PARAMS.PORT, // Redis port
      host: REDIS_PARAMS.HOST, // Redis host
      password: REDIS_PARAMS.PASSWORD,
      db: 0,
    },
  };

  // egg-multipart的参数配置
  // config.multipart = {
  //   mode: 'file',
  //   // 存放上传文件的目录
  //   tmpdir: path.resolve(__dirname, '../tmp-file'),
  //   fileExtensions: [
  //     '.csv',
  //     '.xlsx',
  //     '.xls',
  //   ],
  //   fileSize: '50mb',
  // };

  // config.validate = {
  //   convert: true, // 入参的数据类型自动转换
  //   widelyUndefined: true, // 值为空字符串、NaN、Null转换成undefined
  // };
  // config.queue = {
  //   client: {
  //     queuePrefix: 'q',
  //     redis: {
  //       port: REDIS_PARAMS.PORT,
  //       host: REDIS_PARAMS.HOST,
  //       // auth: 'auth',
  //       password: REDIS_PARAMS.PASSWORD,
  //       db: 3,
  //       options: {
  //       },
  //     },
  //   },
  // };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // 配置CSRF token的默认字段名，前端发送的请求，都要带上这个字段
    security: {
      csrf: {
        enable: false,
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
