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
  return `${appid}${getNowStr()}${getIndexStr()}`;
};

const api = {
  get_token: '/ec/get/token',
  query: {
    sim_base_info: '/ec/query/sim-basic-info',
    sim_status: '/ec/query/sim-status',
    sim_data_usage: '/ec/query/sim-data-usage',
    sim_imei: '/ec/query/sim-imei',
    sim_session: '/ec/query/sim-session',
    on_off_status: '/ec/query/on-off-status',
    member_voice_whitelist: '/ec/query/member-voice-whitelist',
    group_by_member: '/ec/query/group-by-member',
    sim_communication_function_status: '/ec/query/sim-communication-function-status',
    sim_data_margin: '/ec/query/sim-data-margin',
    sim_voice_margin: '/ec/query/sim-voice-margin',
    sim_voice_usage: '/ec/query/sim-voice-usage',
    sim_data_usage_monthly_batch: '/ec/query/sim-data-usage-monthly/batch',
  },
  change: {
    sim_status: '/ec/change/sim-status',
    sim_status_batch: '/ec/change/sim-status/batch',
  },
  config: {
    member_voice_whitelist: '/ec/config/member-voice-whitelist',
  },
  operate: {
    sim_communication_function_batch: '/ec/operate/sim-communication-function/batch',
    card_bind_by_bill_batch: '/ec/operate/card-bind-by-bill/batch',
    sim_call_function: '/ec/operate/sim-call-function',
  },
};
class ChinaMobileService extends BaseService {
  async getOnelink(simId) {
    const { onelinkId } = await this.ctx.service.sim.getSimBySimId(simId);
    const oneLink = await this.ctx.service.onelinkPlatform.getOnelinkById(onelinkId);
    return oneLink;
  }
  async fetchData(url, data, simId, options) {
    const { appId, apiHost, apiVersion, status } = await this.getOnelink(simId);
    if (status === 0) {
      return null;
    }
    data.token = await this.getToken(simId);
    data.transid = getTransid(appId);
    const res = await this.ctx.curl(`${apiHost}${apiVersion}${url}`, {
      data,
      dataType: 'json',
      ...options,
    });
    return this.getResult(res);
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
   * 卡号是否超过100
   * @param {string} mii - msisdns | iccids | imsis 多个号时下划线隔开，如xxxx_xxxx
   */
  isExceedLimit(mii) {
    return _.split(mii, '_').length > 100;
  }
  /**
   * CMIOT_API25000-认证服务接口
   * token 过期时间为 1 小时
   * @param {string} simId - token的key名
   */
  async getToken(simId) {
    // 设置超时时间为50分钟，避免产生时间差
    const EXPIRE_TIME = 50 * 60 * 1000;
    const { nameKey, apiHost, appId, apiVersion, secretKey, status } = await this.getOnelink(simId);
    if (status === 0) {
      return null;
    }
    let token = await this.app.redis.get(nameKey);
    if (token) {
      return token;
    }

    const res = await this.ctx.curl(`${apiHost}${apiVersion}${api.get_token}`, {
      data: {
        appid: appId,
        password: secretKey,
        transid: getTransid(appId),
      },
      dataType: 'json',
    });
    const result = this.getResult(res);
    if (result.length > 0) {
      token = result[0].token;
    }

    const pipeline = await this.app.redis.pipeline();
    await pipeline.set(nameKey, token).pexpire(nameKey, EXPIRE_TIME).exec(() => { });

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
      return [];
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
   * @param {string} simId - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} operType - operType
   * @return {array} [{simId | imsi | iccid}] - 码号信息，同入参
   */
  async changeSimStatus(simId, operType) {
    const data = {
      operType,
      msisdn: simId,
    };
    const res = await this.fetchData(api.change.sim_status, data, simId);
    return res;
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

    if (this.isExceedLimit(msisdns)) {
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
      return [];
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
      return [];
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
      return [];
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
      return [];
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
      return [];
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
      return [];
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
      return [];
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

  /**
   * CMIOT_API23M16-成员语音白名单配置
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）实现集团旗下单个群组成员的语音白名单配置
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} groupId - 成员归属的群组 ID
   * @param {string} operType - 语音白名单配置类型：1：新增 4：删除
   * @param {string} whiteNumber - 成员配置的语音白名单号码, 多个时用下划线分隔，例如：xxxx_xxxx
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} []
   */
  async configMemberVoiceWhitelist(appid, token, hostAndVer, groupId, operType, whiteNumber, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return [];
    }

    // 当 operType=1 新增时，whiteNumber只能传 1 个值。
    // 当 operType=4 删除时，whiteNumber可传 2 个值，2 个号码用下划线分隔，例如：xxxx_xxxx
    const len = _.split(whiteNumber, '_').length;
    const whiteNumberIsRight = (operType === 1 && len === 1) || (operType === 4 && len <= 2 && len >= 1);
    if (!whiteNumberIsRight) {
      const errorInfo = {
        1: '当operType=1新增时，whiteNumber只能传 1 个值',
        4: '当operType=4删除时，whiteNumber可传 2 个值',
      };
      this.ctx.logger.error(`【${errorInfo[operType]}】`);
      return [];
    }

    const data = {
      token,
      groupId,
      operType,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.config.member_voice_whitelist}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23M09-物联卡通信功能开停批量办理
   * 集团客户可以通过卡号调用该接口批量办理物联卡的通信功能（语音、短信、国际漫游、数据通信服务）开停
   * @param {string} msisdns - 物联卡号 多个号码用下划线分隔
   * @param {int} serviceType - 服务类型
   * @param {string} operType - 操作类型
   * @param {string} apnName - APN 名称
   * @return {array} [{jobId}] - 任务流水号
   */
  async operateSimCommunicationFuctionBatch(msisdns, serviceType, operType, apnName) {
    const { logger } = this.ctx;
    const data = {
      msisdns,
      serviceType,
      operType,
      apnName,
    };

    if (serviceType === 11 && _.isNil(apnName)) {
      logger.error('【serviceType 为11 时，apnName必填】');
      return [];
    }

    if (this.isExceedLimit(msisdns)) {
      logger.error('【物联卡号最多 100 个】');
      return [];
    }
    const simId = _.split(msisdns, '_')[0];
    const res = await this.fetchData(`${api.operate.sim_communication_function_batch}`, data, simId);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23M08-单卡通信功能开通查询（替代 CMIOT_API23M01
   * 查询物联卡通信功能开通情况
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  serviceTypeList:[{serviceType, serviceStatus, apnName}]
   * }]
   */
  async querySimCommunicationFunctionStatus(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return [];
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_communication_function_status}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23U07-单卡本月套餐内流量使用量实时查询
   * 实时查询物联卡本月套餐内流量使用量
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  accmMarginList: [{offeringId, offeringName, apnName, totalAmount, useAmount, remainAmount, pccCode}]
   * }]
   */
  async querySimDataMargin(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return [];
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_data_margin}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23A06-批量机卡绑定/解绑（话单侧)
   * 集团客户可以通过卡号（仅 msisdn，最多 100 张）实现批量 SIM 卡在话单侧的机卡绑定、解绑
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdns - 物联卡号多个号码用下划线分隔。例如：xxxx_xxxx_xxxx
   * @param {string} operType - 机卡操作
   * @param {string} bindingStyle - 机卡绑定方式
   * @param {string} tac - IMEI段
   * @return {array} [{jobId}] - 任务查询流水号
   */
  async operateCardBindByBillBatch(appid, token, hostAndVer, msisdns, operType, bindingStyle, tac) {
    const { logger } = this.ctx;
    const data = {
      token,
      msisdns,
      operType,
      bindingStyle,
      tac,
      ...getTransid(appid),
    };

    if (this.isExceedLimit(msisdns)) {
      logger.error('【物联卡号最多 100 个】');
      return [];
    }

    // operType=1 时，该字段必填
    if (operType === 1 && _.isNil(bindingStyle)) {
      logger.error('【operType=1时, bindingStyle必填!】');
      return [];
    }

    // bindingStyle=1 时，该字段为必填
    if (bindingStyle === 1 && _.isNil(tac)) {
      logger.error('【bindingStyle=1时, tac必填!】');
      return [];
    }

    const res = await this.fetchData(`${hostAndVer}${api.operate.card_bind_by_bill_batch}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23U05-单卡本月套餐内语音使用量实时查询
   * 实时查询物联卡本月套餐内语音使用量
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  accmMarginList: [{offeringId, offeringName, totalAmount, useAmount, remainAmount}]
   * }]
   */
  async querySimVoiceMargin(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return [];
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_voice_margin}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23U01-单卡本月语音累计使用量实时查询
   * 实时查询物联卡本月语音累计使用量
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{voiceAmount}] - 语音累积量值，单位：分钟
   */
  async querySimVoiceUsage(appid, token, hostAndVer, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return [];
    }

    const data = {
      token,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_voice_usage}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API23M05-单卡语音功能开停
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）办理集团归属物联卡的语音功能开/停
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} operType - 0:开 1:停
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} iccid - IC 卡的唯一识别号码 (msisdn、iccid、imsi必须有且只有一项)
   * @param {string} imsi - 国际移动用户识别码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{msisdn | imsi | iccid}]
   */
  async operateSimCallFunction(appid, token, hostAndVer, operType, msisdn, iccid, imsi) {
    const mii = this.getMsisdnOrIccidOrImsi(msisdn, iccid, imsi);
    if (mii.length === 0) {
      return [];
    }

    const data = {
      token,
      operType,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.operate.sim_call_function}`, data);
    const result = this.getResult(res);
    return result;
  }

  /**
   * CMIOT_API25U03-物联卡单月 GPRS 流量使用量批量查询
   * 批量（100 张）查询物联卡指定月份的 GPRS 流量使用量，仅支持查询最近 6个月中某月的使用量，其中本月数据截止为前一天。
   * @param {string} appid - appid
   * @param {string} token - token
   * @param {string} hostAndVer - 主机和版本
   * @param {string} queryDate - 查询最近 6 个月中的某月，其中本月数据截止为前一天，日期格式为 yyyyMM
   * @param {string} msisdns - 物联卡号码, 多个号码用下划线分隔 (msisdns、iccids、imsis必须有且只有一项)
   * @param {string} iccids - IC 卡的唯一识别号码, 多个号码用下划线分隔 (msisdns、iccids、imsis必须有且只有一项)
   * @param {string} imsis - 国际移动用户识别码, 多个号码用下划线分隔 (msisdns、iccids、imsis必须有且只有一项)
   * @return {array} [{
   *  dataAmountList: [{
   *    msisdn | imsi | iccid,
   *    dataAmount,
   *    apnDataAmountList: [{apnName, apnDataAmount}]
   *  }]
   * }]
   */
  async querySimDataUsageMonthlyBatch(appid, token, hostAndVer, queryDate, msisdns, iccids, imsis) {
    const { logger } = this.ctx;

    const mii = this.getMsisdnOrIccidOrImsi(msisdns, iccids, imsis);
    if (mii.length === 0) {
      return [];
    }

    if (this.isExceedLimit(Object.values(mii)[0])) {
      logger.error('【物联卡号最多 100 个】');
      return [];
    }

    const data = {
      token,
      queryDate,
      ...getTransid(appid),
      ...mii,
    };

    const res = await this.fetchData(`${hostAndVer}${api.query.sim_data_usage_monthly_batch}`, data);
    const result = this.getResult(res);
    return result;
  }
}
module.exports = ChinaMobileService;
