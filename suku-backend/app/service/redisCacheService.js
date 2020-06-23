'use strict';

/**
 * redis缓存
 */
const BaseService = require('../core/baseService');

class RedisCacheService extends BaseService {
  /**
   * 批量删除key
   * @param {string} pattern key的正则表达式
   */
  async batchDelKey(pattern) {
    const { redis } = this.app;
    const allKeys = await redis.keys(pattern);
    const pipeline = await redis.pipeline();
    allKeys.forEach(key => {
      pipeline.del(key);
    });
    return await pipeline.exec();
  }

}

module.exports = RedisCacheService;
