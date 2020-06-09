// 验证token是否有效
'use strict';
const ERRORMSG = require('../extend/errorCode');
module.exports = (options, app) => {
  return async function checkToken(ctx, next) {
    const { header, url } = ctx.request;

    // 除登录接口外，其它接口需要验证token有效性
    if (url !== '/login' && url !== '/logout' && url !== '/getCaptcha') {
      const requestToken = header['x-csrf-token'];
      if (requestToken === undefined) {
        ctx.body = {
          code: '',
          success: false,
          msg: '头部缺少x-csrf-token',
          data: null,
        };
        return;
      }
      const loginUserInfo = ctx.helper.loginUser.parse(ctx.cookies.get('loginUserInfo')) || {};
      const tokenName = loginUserInfo.username;
      const redisToken = await app.redis.get(tokenName);

      if (redisToken === null || requestToken !== redisToken) {
        ctx.body = {
          code: ERRORMSG.TOKEN_PAST_DUE.CODE,
          success: false,
          msg: ERRORMSG.TOKEN_PAST_DUE.MSG,
          data: null,
        };
        return;
      }

      ctx.service.token.resetExpire(tokenName);
    }

    await next();

  };
};
