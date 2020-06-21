'use strict';
const API_CONFIG = {
  1: {
    url: '/ec/get/token',
    name: 'CMIOT_API25000-认证服务接口',
    type: 1,
  },
  2: {
    url: '/ec/query/sim-basic-info',
    name: 'CMIOT_API23S00-单卡基本信息查询',
    type: 1,
  },
  3: {
    url: '/ec/query/sim-status',
    name: 'CMIOT_API25S04-单卡状态查询',
    type: 1,
  },
  4: {
    url: '/ec/query/sim-data-usage',
    name: 'CMIOT_API25U04-单卡本月流量累计使用量查询',
    type: 1,
  },
  5: {
    url: '/ec/query/sim-imei',
    name: 'CMIOT_API23S04-单卡绑定IMEI实时查询',
    type: 1,
  },
  6: {
    url: '/ec/query/sim-session',
    name: 'CMIOT_API25M01-单卡在线信息实时查询',
    type: 1,
  },
  7: {
    url: '/ec/query/on-off-status',
    name: 'CMIOT_API25M00-单卡开关机状态实时查询',
    type: 1,
  },
  8: {
    url: '/ec/query/member-voice-whitelist',
    name: 'CMIOT_API23M15-成员语音白名单查询',
    type: 1,
  },
  9: {
    url: '/ec/query/group-by-member',
    name: 'CMIOT_API23E02-成员归属群组查询',
    type: 1,
  },
  10: {
    url: '/ec/query/sim-communication-function-status',
    name: 'CMIOT_API23M08-单卡通信功能开通查询',
    type: 1,
  },
  11: {
    url: '/ec/query/sim-data-margin',
    name: 'CMIOT_API23U07-单卡本月套餐内流量使用量实时查询',
    type: 1,
  },
  12: {
    url: '/ec/query/sim-voice-margin',
    name: 'CMIOT_API23U05-单卡本月套餐内语音使用量实时查询',
    type: 1,
  },
  13: {
    url: '/ec/query/sim-voice-usage',
    name: 'CMIOT_API23U01-单卡本月语音累计使用量实时查询',
    type: 1,
  },
  14: {
    url: '/ec/query/sim-data-usage-monthly/batch',
    name: 'CMIOT_API25U03-物联卡单月GPRS流量使用量批量查询',
    type: 1,
  },
  15: {
    url: '/ec/query/sim-batch-result',
    name: 'CMIOT_API23M10-物联卡业务批量办理结果查询',
    type: 1,
  },
  16: {
    url: '/ec/change/sim-status',
    name: 'CMIOT_API23S03-单卡状态变更',
    type: 2,
  },
  17: {
    url: '/ec/change/sim-status/batch',
    name: 'CMIOT_API23S06-物联卡状态变更批量办理',
    type: 2,
  },
  18: {
    url: '/ec/config/member-voice-whitelist',
    name: 'CMIOT_API23M16-成员语音白名单配置',
    type: 3,
  },
  19: {
    url: '/ec/operate/sim-communication-function/batch',
    name: 'CMIOT_API23M09-物联卡通信功能开停批量办理',
    type: 4,
  },
  20: {
    url: '/ec/operate/card-bind-by-bill/batch',
    name: 'CMIOT_API23A06-批量机卡绑定/解绑',
    type: 4,
  },
  21: {
    url: '/ec/operate/sim-call-function',
    name: 'CMIOT_API23M05-单卡语音功能开停',
    type: 4,
  },
  22: {
    url: '/ec/operate/sim-sms-function',
    name: 'CMIOT_API23M06-单卡短信功能开停',
    type: 4,
  },
  23: {
    url: '/ec/operate/sim-apn-function',
    name: 'CMIOT_API23M07-单卡数据功能开停',
    type: 4,
  },
};
function getApi(key) {
  return API_CONFIG[key];
}
module.exports = () => {
  return { API_CONFIG, getApi };
};
