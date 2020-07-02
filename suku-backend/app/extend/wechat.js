'use strict';
const WX_CONFIG = {
  APPID: 'wxea710ac5bcb962d5',
  MICHID: '1536554531',
  APPSECRET: '965cc87627449c10ee1436ac5ac26571',
};

const API = {
  ACCESS_TOKEN: 'https://api.weixin.qq.com/sns/oauth2/access_token',
};
module.exports = () => {
  return { WX_CONFIG, API };
};
