'use strict';

const moment = require('moment');
const _ = require('lodash');

const BaseService = require('../core/baseService');

// 8位序号, 如：00000001
let index = 0;
const getIndexStr = () => {
  index += 1;
  if (index > 99999999) index = 1;
  return index.toString().padStart(8, '0');
};

// 当前时间字符串, 12小时制的
const getNowStr = () => {
  return moment().format('YYYYMMDDhhmmss');
};

// 获取transid
const getTransid = appid => {
  return {
    transid: `${appid}${getNowStr()}${getIndexStr()}`,
  };
};

const api = {
  get_token: '/ec/get/token',
  query: {
    sim_base_info: '/ec/query/sim-basic-info',
    sim_status: '/etc/query/sim-status',
    sim_data_usage: '/etc/query/sim-data-usage',
    sim_imei: '/etc/query/sim-imei',
    sim_session: '/etc/query/sim-session',
    on_off_status: '/etc/query/on-off-status',
    member_voice_whitelist: '/etc/query/member_voice_whitelist',
    group_by_member: '/etc/query/group-by-member',
  },
  change: {
    sim_status: '/ec/change/sim-status',
    sim_status_batch: '/ec/change/sim-status/batch',
  },
};

class ChinaMobileService extends BaseService {
  async fetchData(url, data, options) {
    return await this.ctx.capi(url, {
      data,
      dataType: 'json',
      ...options,
    });
  }

  getResult(res) {
    if (res.status === 200) {
      const resData = res.data;
      if (resData.status === '0') {
        return resData.result;
      }
      this.ctx.logger.error(res.message);
      return [];

    }
    this.ctx.logger.error(`【异常状态码】: ${res.status}`);
    return [];
  }

  /**
   * 获取msisdn/iccid/imsi中的一个
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {string} msisdn | iccid | imsi
   */
  getMsisdnOrIccidOrImsi(msisdn, iccid, imsi) {
    const { logger } = this.ctx;
    const { error } = logger;

    // msisdn、iccid、imsi必须有且只有一项
    const mii = [
      { msisdn },
      { iccid },
      { imsi },
    ].filter(item => !_.isNil(item));

    if (mii.length !== 1) {
      error('【msisdn、iccid、imsi必须有且只有一项！】');
      return [];
    }

    return mii[0];
  }
  /**
   * CMIOT_API25000-认证服务接口
   * token 过期时间为 1 小时
   * @param {string} nameKey - token的key名
   * @param {string} appid - appid
   * @param {string} password -密码
   * @param {string} hostAndVer - 主机和版本
   */
  async getToken(nameKey, appid, password, hostAndVer) {
    // 设置超时时间为50分钟，避免产生时间差
    const EXPIRE_TIME = 50 * 60 * 1000;
    let token = await this.app.redis.get(nameKey);

    if (token) {
      return token;
    }

    const res = await this.fetchData(`${hostAndVer}${api.get_token}`, {
      appid,
      password,
      ...getTransid(appid),
    });
    const result = this.getResult(res);
    if (result.length > 0) {
      token = result[0].token;
    }

    const pipeline = await this.app.redis.pipeline();
    await pipeline.set(nameKey, token).pexpire(nameKey, EXPIRE_TIME).exec((err, results) => { });

    return token;
  }

  /**
   * CMIOT_API23S00-单卡基本信息查询
   * 查询物联卡码号信息、开卡时间、首次激活时间
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{ msisdn, imsi, iccid, activeDate, openDate}] - 物联卡号码, 国际移动用户识别码, IC 卡的唯一识别号码, 激活日期（首次）, 开卡时间
   */
  async querySimBasicInfo(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_base_info}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23S03-单卡状态变更
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} operType - operType
   * @return {array} [{msisdn | imsi | iccid}] - 码号信息，同入参
   */
  async changeSimStatus(appid, token, hostAndVer, msisdn, iccid, imsi, operType) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      operType,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.change.sim_status}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23S06-物联卡状态变更批量办理
   * 集团客户可以通过卡号调用该接口批量办理物联卡的状态变更，每次不超过100 张卡，同一卡号 30 分钟内不得重复调用该接口
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdns - 物联卡号码 (多个号码用下划线分隔。例如：xxxx_xxxx_xxxx)
   * @param {int} operType - 操作类型
   * @param {string} reason - 停复机原因 (在 operType 为 9或 11 时，原因必传01：主动停复机)
   * @return {array} [{jobId}] - 任务流水号
   */
  async changeSimStatusBatch(appid, token, hostAndVer, msisdns, operType, reason) {
    const { logger } = this.ctx;
    const { error } = logger;

    const data = {
      token,
      ...getTransid(appid),
      reason,
    };

    // 在 operType 为 9或 11 时，原因必传01：主动停复机
    if ([ 9, 11 ].indexOf(operType) > -1 && _.isNil(reason)) {
      data.reason = '01：主动停复机';
    }

    if (_.split(msisdns).length > 100) {
      error('【查询的物联卡号最多不超过100个！】');
      return;
    }

    data.msisdns = msisdns;

    const res = await this.fetchData(`${hostAndVer}${api.change.sim_status_batch}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API25S04-单卡状态查询(替代CMIOT_API23S01)
   * 通过卡号查询物联卡的状态信息
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{cardStatus, lastChangeDate}] - 物联卡状态, 最后一次变更时间
   */
  async querySimStatus(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_status}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API25U04-单卡本月流量累计使用量查询（替代CMIOT_API23U03）
   * 查询集团所属物联卡当月的 GPRS 使用量，PB 号段为截至前一天 24 点流量，CT 号段为实时流量。（单位：KB）。
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  dataAmount,
   *  apnUseAmountList: [
   *    {apnName, apnUseAmount, pccCodeUseAmountList: [{pccCode, pccCodeUseAmount}]}
   *  ]
   * }]
   */
  async querySimDataUsage(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_data_usage}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23S04-单卡绑定 IMEI 实时查询
   * 通过卡号查询物联卡绑定的 IMEI 信息
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{imei}] - IMEI 号码
   */
  async querySimImei(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_imei}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API25M01-单卡在线信息实时查询
   * 查询物联卡的在线信息，区分 APN，返回 APN 信息、IP 地址、会话创建时间。
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  simSessionList: [{apnId, status, ip, createDate, rat}]
   * }]
   */
  async querySimSession(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_session}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API25M00-单卡开关机状态实时查询
   * 查询终端的开关机信息
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{status}] - 终端的开关机状态, 0:关机 1:开机
   */
  async queryOnOffStatus(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.on_off_status}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23M15-成员语音白名单查询
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）实现集团旗下单个群组成员的语音白名单查询。
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} groupId - 成员归属的群组 ID
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  totalCount,
   *  memVoiceWhiteList:[
   *    {whiteNumber, status}
   *  ]
   * }]
   */
  async queryMemberVoiceWhitelist(appid, token, hostAndVer, groupId, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      groupId,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.on_off_status}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23E02-成员归属群组查询
   * 查询物联卡归属的群组信息
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  groupList: [
   *    {groupId, offeringId, offeringName}
   *  ]
   * }]
   */
  async queryGroupByMember(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return;
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.group_by_member}`, data);
    const result = this.getResult(res);
    return result;
  }
}
module.exports = ChinaMobileService;
