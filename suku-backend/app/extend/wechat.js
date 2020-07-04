'use strict';
const Tenpay = require('tenpay');
const WX_CONFIG = {
  APPID: 'wxea710ac5bcb962d5',
  MICHID: '1536554531',
  APPSECRET: '965cc87627449c10ee1436ac5ac26571',
  PARTNERKEY: 'LZM123aabbccEEZLZMlzm83769776123', // partnerKey
  NOTIFY_URL: 'api.sukudianzi.com', // notify_url
};
// const WX_CONFIG = {
//   APPID: 'wxc3a09378c6f6fb74',
//   MICHID: '1551436281',
//   APPSECRET: 'b3096dee738880e68418657367e9dd60',
//   PARTNERKEY: 'BaVOdsHox5IZ9I1TcAAONXpFlYEIjUg5', // partnerKey
//   NOTIFY_URL: 'http://www.sukudianzi.com/', // notify_url
// };
const payConfig = {
  appid: WX_CONFIG.APPID,
  mchid: WX_CONFIG.MICHID,
  partnerKey: WX_CONFIG.PARTNERKEY,
  notify_url: WX_CONFIG.NOTIFY_URL,
  spbill_create_ip: '47.115.75.162',
};
const payApi = new Tenpay(payConfig);
const API = {
  ACCESS_TOKEN: 'https://api.weixin.qq.com/sns/oauth2/access_token',
};
module.exports = () => {
  return { WX_CONFIG, API, payApi };
};
