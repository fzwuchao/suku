'use strict';

/**
 * token服务
 */
const Service = require('egg').Service;
// 半个小时，毫秒
const EXPIRE_TIME = 30 * 60 * 1000;

class TokenService extends Service {
  async getToken(tokenName) {
    const { app, ctx } = this;
    const token = app.jwt.sign({
      tokenName,
    }, this.app.config.jwt.secret);


    // 写入到redis的成功与否，false表示写入失败，true表示写入成功
    let isOK = false;
    // pipeline可以批量执行多个命令
    const pipeline = await app.redis.pipeline();
    // 设置token超时时间: 半个小时
    await pipeline.set(tokenName, token).pexpire(tokenName, EXPIRE_TIME).exec((err, results) => {
      if (results.length !== 2 || results[0][1] !== 'OK' || results[1][1] !== 1) {
        isOK = false;
        ctx.logger.error('token写入到redis失败');
        return;
      }
      isOK = true;
    });
    ctx.logger.info('【生成的token】:', token);
    return isOK ? token : null;
  }

  async removeToken(tokenName) {
    await this.app.redis.del(tokenName);
  }

  // 重新设置token超时时间
  async resetExpire(tokenName) {
    await this.app.redis.pexpire(tokenName, EXPIRE_TIME);
  }

}

module.exports = TokenService;
