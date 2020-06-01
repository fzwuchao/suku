'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 生成token
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // 跨域
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // mysql
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  // redis
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  // sequelize
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  // 用于请求参数的检验
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};
