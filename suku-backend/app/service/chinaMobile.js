'use strict';

const moment = require('moment');
const _ = require('lodash');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const retcodeMap = {
  '00': '成功',
  '01': '失败',
  '02': '接收方号码为空',
  '03': '接收方号码错误',
  '04': '短信内容为空',
  '05': '鉴权ID为空',
  '06': '鉴权失败',
};
const messageParams = {
  id: 31, // MAS分配编号
  pwd: 'JNQov+AilMvpu0jrRLBgDOh2rha1h+PGM075YYycMt88Zbeya8bexQ==', // MAS分配密钥
  serviceId: '1064899140165',
};

const BaseService = require('../core/baseService');
const { getApi } = require('../extend/api')();
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

/* const OPREATE_TYPE = {
  query: 1,
  change: 2,
  config: 3,
  operate: 4,
}; */
class ChinaMobileService extends BaseService {
  async sendXML(xml, interfaceType) {
    const interfaceTypeMap = {
      // send: 'http://localhost:7001/testMsgSend',
      send: 'http://117.169.32.136:28181/sjb/HttpSendSMSService',
      delivery: 'http://localhost:7001/testMsgSendUpgoing',
    };
    const url = interfaceTypeMap[interfaceType];
    const resState = { success: false, msg: '', data: null };
    const result = await this.ctx.curl(url, {
      method: 'POST',
      contentType: 'text/xml; charset=utf-8',
      data: xml,
      dataType: 'text',
    });
    if (result.status !== 200) {
      this.ctx.logger.error(`【Http异常状态码】: ${result.status}`);
      resState.success = false;
      resState.msg = result.status;
      return resState;
    }
    resState.success = true;

    await parser.parseStringPromise(result.data).then(rs => {
      resState.data = rs;
    }).catch(err => {
      resState.success = false;
      resState.msg = err;
    });

    return resState;
  }

  async getOnelink(simId) {
    const { onelinkId } = await this.ctx.service.sim.getSimBySimId(simId);
    const oneLink = await this.ctx.service.onelinkPlatform.getOnelinkById(onelinkId);
    return oneLink;
  }
  async fetchData(apiKey, data, simId, options) {
    const { appId, apiHost, apiVersion, status, id } = await this.getOnelink(simId);
    if (status === 0) {
      return null;
    }
    // const params = JSON.parse(JSON.stringify(data));
    data.token = await this.getToken(simId);
    data.transid = getTransid(appId);
    const api = getApi(apiKey);
    const res = await this.ctx.curl(`${apiHost}${apiVersion}${api.url}`, {
      data,
      dataType: 'json',
      timeout: 12000,
      ...options,
    });
    return await this.getResult(res, api, data, id);
  }

  async getResult(res, api, params, onelinkId) {
    if (res.status === 200) {
      const resData = res.data;
      if (resData.status === '0') {
        const jobId = (resData.result[0] || {}).jobId;
        if (jobId) {
          const result = await this.querySimBatchResult(jobId, params.msisdns,
            params,
            api, onelinkId);
          return result;
        }
        return resData.result;
      }
      resData.error = true;
      const errorLog = {};
      if (api) {
        errorLog.type = api.type;
        errorLog.url = api.url;
        errorLog.name = api.name;
      }
      errorLog.onelinkId = onelinkId;
      errorLog.status = resData.status;
      errorLog.message = resData.message;
      errorLog.source = 1;
      errorLog.result = JSON.stringify(res);
      errorLog.params = JSON.stringify(params);
      await this.ctx.service.errorLog.create(errorLog);
      if (resData.status === '12021') {
        await this.app.runSchedule('tokenCurl');
      }
      resData.errorCode = resData.status;
      resData.errorInfo = resData.message;
      this.ctx.logger.error(`【业务异常状态码】: ${resData.status} 【业务异常描述】:${resData.message}`);
      return resData;
    }
    this.ctx.logger.error(`【Http异常状态码】: ${res.status}`);
    return res;
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
    const { nameKey, status } = await this.getOnelink(simId);
    if (status === 0) {
      return null;
    }
    const token = await this.app.redis.get(`${nameKey}_token`);
    if (token) {
      return token;
    }
  }

  async getTokenCurl() {
    const results = await this.ctx.service.onelinkPlatform.getAllOnelinkDesc();
    /* results = JSON.stringify(results);
    console.log(results) */
    const url = getApi(1).url;

    for (let i = 0; i < results.length; i++) {
      const { nameKey, apiHost, appId, apiVersion, secretKey, id } = results[i];
      const res = await this.ctx.curl(`${apiHost}${apiVersion}${url}`, {
        data: {
          appid: appId,
          password: secretKey,
          transid: getTransid(appId),
        },
        dataType: 'json',
      });
      const api = getApi(1);
      const result = await this.getResult(res, api, {
        appid: appId,
        password: secretKey,
        transid: getTransid(appId),
      }, id);
      let token = null;
      if (result.length > 0) {
        token = result[0].token;
      }
      this.ctx.logger.info(`#####${token}#####`);
      await this.app.redis.set(`${nameKey}_token`, token);
    }
  }

  /**
   * 通过url、msisdn、data，处理数据
   * @param {string} url - ur
   * @param {string} msisdn - 物联卡号
   * @param {object} data - 请求数据
   */
  async handleBy(url, msisdn, data) {
    if (_.isNil(msisdn)) {
      return [];
    }
    if (msisdn.length > 13) {
      msisdn = _.split(msisdn, '_')[0];
    }
    const result = await this.fetchData(url, data, msisdn);
    return result;
  }

  /**
   * CMIOT_API23S00-单卡基本信息查询
   * 查询物联卡码号信息、开卡时间、首次激活时间
   * @param {string} msisdn - 物联卡号码
   * @return {datetime} activeDate - 激活日期（首次）
   */
  async querySimBasicInfo(msisdn) {
    const result = await this.handleBy(2, msisdn, { msisdn });
    const { activeDate } = result[0] || {};
    let activeDt = null;
    if (activeDate !== ' ' && !_.isNil(activeDate)) {
      activeDt = moment(activeDate).toDate();
    }
    return activeDt;
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
    const result = await this.handleBy(16, simId, data);
    return result;
  }

  /**
   * CMIOT_API23S06-物联卡状态变更批量办理
   * 集团客户可以通过卡号调用该接口批量办理物联卡的状态变更，每次不超过100 张卡，同一卡号 30 分钟内不得重复调用该接口
   * @param {string} msisdns - 物联卡号码 (多个号码用下划线分隔。例如：xxxx_xxxx_xxxx)
   * @param {int} operType - 操作类型
   * @param {string} reason - 停复机原因 (在 operType 为 9或 11 时，原因必传01：主动停复机)
   * @return {array} [{jobId}] - 任务流水号
   */
  async changeSimStatusBatch(msisdns, operType, reason) {
    const { logger } = this.ctx;
    const { error } = logger;

    const data = {
      operType,
      reason,
    };

    // 在 operType 为 9或 11 时，原因必传01：主动停复机
    if ([ 9, 11 ].indexOf(operType) > -1 && _.isNil(reason)) {
      data.reason = '01';
    }

    if (this.isExceedLimit(msisdns)) {
      error('【查询的物联卡号最多不超过100个！】');
      return [];
    }

    data.msisdns = msisdns;

    const simId = _.split(msisdns, '_')[0];
    const result = await this.handleBy(17, simId, data);
    return result;
  }

  /**
   * CMIOT_API25S04-单卡状态查询(替代CMIOT_API23S01)
   * 通过卡号查询物联卡的状态信息
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {string} cardStatus - 物联卡状态
   */
  async querySimStatus(msisdn) {
    const result = await this.handleBy(3, msisdn, { msisdn });
    const { cardStatus } = result[0] || {};
    return cardStatus;
  }

  /**
   * CMIOT_API25U04-单卡本月流量累计使用量查询（替代CMIOT_API23U03）
   * 查询集团所属物联卡当月的 GPRS 使用量，PB 号段为截至前一天 24 点流量，CT 号段为实时流量。（单位：KB）。
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {number} usedFlow - 已用流量(M)
   */
  async querySimDataUsage(msisdn) {
    const result = await this.handleBy(4, msisdn, { msisdn });
    const { dataAmount } = result[0] || {};
    // 单位：M
    let usedFlow = 0;
    // 单位：KB, 返回" "时，表示卡未产生用量或未订购套餐
    if (dataAmount !== ' ' && !_.isNil(dataAmount)) {
      usedFlow = Number(dataAmount) / 1024;
    }
    return usedFlow;
  }

  /**
   * CMIOT_API23S04-单卡绑定 IMEI 实时查询
   * 通过卡号查询物联卡绑定的 IMEI 信息
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{imei}] - IMEI 号码
   */
  async querySimImei(msisdn) {
    const result = await this.handleBy(5, msisdn, { msisdn });
    return result;
  }

  /**
   * CMIOT_API25M01-单卡在线信息实时查询
   * 查询物联卡的在线信息，区分 APN，返回 APN 信息、IP 地址、会话创建时间。
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  simSessionList: [{apnId, status, ip, createDate, rat}]
   * }]
   */
  async querySimSession(msisdn) {
    const result = await this.handleBy(6, msisdn, { msisdn });
    return result;
  }

  /**
   * CMIOT_API25M00-单卡开关机状态实时查询
   * 查询终端的开关机信息
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {string} status - 终端的开关机状态, 0:关机 1:开机
   */
  async queryOnOffStatus(msisdn) {
    const result = await this.handleBy(7, msisdn, { msisdn });
    const { status } = result[0] || {};
    return status;
  }

  /**
   * CMIOT_API23M15-成员语音白名单查询
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）实现集团旗下单个群组成员的语音白名单查询。
   * @param {string} groupId - 成员归属的群组 ID
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  totalCount,
   *  memVoiceWhiteList:[
   *    {whiteNumber, status}
   *  ]
   * }]
   */
  async queryMemberVoiceWhitelist(groupId, msisdn) {
    const result = await this.handleBy(8, msisdn, { msisdn, groupId });
    return result;
  }

  /**
   * CMIOT_API23E02-成员归属群组查询
   * 查询物联卡归属的群组信息
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  groupList: [
   *    {groupId, offeringId, offeringName}
   *  ]
   * }]
   */
  async queryGroupByMember(msisdn) {
    const { nameKey, status } = await this.getOnelink(msisdn);
    await this.app.redis.del(`${nameKey}_groupId`);
    if (status === 0) {
      return null;
    }
    let groupId = await this.app.redis.get(`${nameKey}_groupId`);
    if (groupId) {
      return groupId;
    }

    const result = await this.handleBy(9, msisdn, { msisdn });
    if (result.length > 0) {
      groupId = result[0].groupList[0].groupId;
    }
    // await this.app.redis.set(`${nameKey}_groupId`, groupId);

    return groupId;
  }

  /**
   * CMIOT_API23M16-成员语音白名单配置
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）实现集团旗下单个群组成员的语音白名单配置
   * @param {string} operType - 语音白名单配置类型：1：新增 4：删除
   * @param {string} whiteNumber - 成员配置的语音白名单号码, 多个时用下划线分隔，例如：xxxx_xxxx
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} []
   */
  async configMemberVoiceWhitelist(operType, whiteNumber, msisdn) {
    // 当 operType=1 新增时，whiteNumber只能传 1 个值。
    // 当 operType=4 删除时，whiteNumber可传 2 个值，2 个号码用下划线分隔，例如：xxxx_xxxx
    const groupId = await this.queryGroupByMember(msisdn);
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
      groupId,
      operType,
      msisdn,
      whiteNumber,
    };

    const result = await this.handleBy(18, msisdn, data);
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
    const result = await this.handleBy(19, simId, data);
    // const jobId = (result[0] || {}).jobId;
    // await this.querySimBatchResult(jobId, simId,
    //   { msisdns, serviceType, operType, apnName },
    //   api.operate.sim_communication_function_batch);
    return result;
  }

  /**
   * CMIOT_API23M08-单卡通信功能开通查询（替代 CMIOT_API23M01
   * 查询物联卡通信功能开通情况
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {object} {voiceServStatus, msgServStatus, flowServStatus}
   */
  async querySimCommunicationFunctionStatus(msisdn) {
    const result = await this.handleBy(10, msisdn, { msisdn });
    const { serviceTypeList = [] } = result[0] || {};
    const servStatus = {};
    const serviceType = {
      '01': 'voiceServStatus', // 语音服务,
      '08': 'msgServStatus', // 短信服务
      11: 'flowServStatus', // 流量服务
    };
    serviceTypeList.forEach(item => {
      servStatus[serviceType[item.serviceType]] = item.serviceStatus;
    });
    return servStatus;
  }

  /**
   * CMIOT_API23U07-单卡本月套餐内流量使用量实时查询
   * 实时查询物联卡本月套餐内流量使用量
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  accmMarginList: [{offeringId, offeringName, apnName, totalAmount, useAmount, remainAmount, pccCode}]
   * }]
   */
  async querySimDataMargin(msisdn) {
    const result = await this.handleBy(11, msisdn, { msisdn });
    return result;
  }

  /**
   * CMIOT_API23A06-批量机卡绑定/解绑（话单侧)
   * 集团客户可以通过卡号（仅 msisdn，最多 100 张）实现批量 SIM 卡在话单侧的机卡绑定、解绑
   * @param {string} msisdns - 物联卡号多个号码用下划线分隔。例如：xxxx_xxxx_xxxx
   * @param {string} operType - 机卡操作
   * @param {string} bindingStyle - 机卡绑定方式
   * @param {string} tac - IMEI段
   * @return {array} [{jobId}] - 任务查询流水号
   */
  async operateCardBindByBillBatch(msisdns, operType, bindingStyle, tac) {
    const { logger } = this.ctx;
    const data = {
      msisdns,
      operType,
      bindingStyle,
      tac,
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

    const simId = _.split(msisdns, '_')[0];
    const result = await this.handleBy(20, simId, data);
    return result;
  }

  /**
   * CMIOT_API23U05-单卡本月套餐内语音使用量实时查询
   * 实时查询物联卡本月套餐内语音使用量
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{
   *  accmMarginList: [{offeringId, offeringName, totalAmount, useAmount, remainAmount}]
   * }]
   */
  async querySimVoiceMargin(msisdn) {
    const result = await this.handleBy(12, msisdn, { msisdn });
    return result;
  }

  /**
   * CMIOT_API23U01-单卡本月语音累计使用量实时查询
   * 实时查询物联卡本月语音累计使用量
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {number} voiceAmount - 语音累积量值，单位：分钟
   */
  async querySimVoiceUsage(msisdn) {
    const result = await this.handleBy(13, msisdn, { msisdn });
    const va = (result[0] || {}).voiceAmount;
    let voiceAmount = 0;
    // 返回" "时,表示卡未产生用量或者未订购套餐
    if (va !== ' ' && !_.isNil(va)) {
      voiceAmount = Number(va);
    }
    return voiceAmount;
  }

  /**
   * CMIOT_API23M05-单卡语音功能开停
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）办理集团归属物联卡的语音功能开/停
   * @param {string} operType - 0:开 1:停
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{msisdn | imsi | iccid}]
   */
  async operateSimCallFunction(operType, msisdn) {
    const data = {
      operType,
      msisdn,
    };

    const result = await this.handleBy(21, msisdn, data);
    return result;
  }

  /**
   * CMIOT_API23M07-单卡数据功能开停
   * 集团客户可以通过卡号（msisdn\iccid\imsi 三选一，单卡）办理集团归属物联卡的语音功能开/停
   * @param {string} operType - 0:开 1:停
   * @param {string} msisdn - 物联卡号码 (msisdn、iccid、imsi必须有且只有一项)
   * @return {array} [{msisdn | imsi | iccid}]
   */
  async operateSimApnFunction(operType, msisdn) {
    const data = {
      operType,
      msisdn,
      apnName: 'CMIOT',
    };

    const result = await this.handleBy(23, msisdn, data);
    return result;
  }

  /**
   * CMIOT_API25U03-物联卡单月 GPRS 流量使用量批量查询
   * 批量（100 张）查询物联卡指定月份的 GPRS 流量使用量，仅支持查询最近 6个月中某月的使用量，其中本月数据截止为前一天。
   * @param {string} queryDate - 查询最近 6 个月中的某月，其中本月数据截止为前一天，日期格式为 yyyyMM
   * @param {string} msisdns - 物联卡号码, 多个号码用下划线分隔 (msisdns、iccids、imsis必须有且只有一项)
   * @return {array} [{
   *  dataAmountList: [{
   *    msisdn | imsi | iccid,
   *    dataAmount,
   *    apnDataAmountList: [{apnName, apnDataAmount}]
   *  }]
   * }]
   */
  async querySimDataUsageMonthlyBatch(queryDate, msisdns) {
    const { logger } = this.ctx;

    if (this.isExceedLimit(msisdns)) {
      logger.error('【物联卡号最多 100 个】');
      return [];
    }

    const data = {
      queryDate,
      msisdns,
    };

    const simId = _.split(msisdns, '_')[0];
    const result = await this.handleBy(14, simId, data);
    return result;
  }

  /**
   * CMIOT_API23M06-单卡短信功能开停
   * @param {string} msisdn - 物联卡号
   * @param {string} operType - 0:开 1:停
   */
  async operateSimSmsFunction(operType, msisdn) {
    const data = {
      msisdn,
      operType,
    };
    const result = await this.handleBy(22, msisdn, data);
    return result;
  }

  /**
   * CMIOT_API23E04-群组成员流量限额设置
   * @param {*} msisdn - 物联卡号码
   * @param {*} groupId - 群组 ID
   * @param {*} offerId - 群组订购的资费商品 ID
   * @param {*} apnName - APN 名称
   * @param {*} operType - 限额设置的操作：1：添加 2：删除 3：变更
   * @param {*} limitValue - 限额值：单位 MB
   * @param {*} actionRule - 限额规则：达到限额值，将执行的业务规则 1:停数据通信服务 2:使用流量池外资费
   */
  /* async limitGroupMemberDataUsage(msisdn, groupId, offerId, apnName, operType, limitValue, actionRule) {
    const data = {
      msisdn,
      groupId,
      offerId,
      apnName,
      operType,
    };

    if (!_.isNil(limitValue)) data.limitValue = limitValue;
    if (!_.isNil(actionRule)) data.actionRule = actionRule;

    const result = await this.handleBy(api.operate.sim_sms_function, msisdn, data);
    return result;
  } */

  /**
   * CMIOT_API23M10-物联卡业务批量办理结果查询
   * 集团客户可以通过物联卡批量处理的任务流水号接口查询物联卡业务批量办理的结果。
   * @param {string} jobId - 物联卡批量处理的任务流水号
   * @param {string} msisdn - 物联卡
   * @param {string} params - 物联卡
   * @param {string} api - 物联卡批量处理的任务流水号
   * @param {string} onelinkId - 物联卡批量处理的任务流水号
   * @return {object} {failure?, failCode?, failInfo?, failData?} - 有错误时才有错误字段
   */
  async querySimBatchResult(jobId, msisdn, params, api, onelinkId) {
    const result = await this.handleBy(15, msisdn, { jobId });
    if (result.length === 0) {
      return;
    }
    const { jobStatus } = result[0];
    const jobLog = { jobStatus, jobId };
    jobLog.result = JSON.stringify(result);
    if (api) {
      jobLog.url = api.url;
      jobLog.name = api.name;
    }
    if (onelinkId) {
      jobLog.onelinkId = onelinkId;
    }
    if (jobStatus === '3' || jobStatus === '2' || jobStatus === '4') {
      if (params) {
        jobLog.params = JSON.stringify(params);
      }
      const { resultList } = result[0];
      const errorIds = [];
      const sucessIds = [];
      for (let i = 0; i < resultList.length; i++) {
        if (resultList[i].status === '0') {
          sucessIds.push(resultList[i].resultId);
        } else {
          errorIds.push(resultList[i].resultId);
        }
      }
      result.sucessIds = sucessIds;
      result.errorIds = errorIds;
      jobLog.errorSim = JSON.stringify(errorIds);
    } else {
      if (params) {
        jobLog.params = params;
      }
    }
    if (jobStatus === '3' || jobStatus === '4') {
      await this.ctx.service.jobLog.create(jobLog);
    }
    if (jobStatus === '0' || jobStatus === '1') {
      this.app.queue.create('jobLog', jobLog).delay(10000 * 60) // 延时多少毫秒
        .save();
    }
    return result;
  }

  /**
   * 发送短信
   * @param {string} phone - 接收方号码, 多个号码用英文逗号隔开
   * @param {string} content - 短信内容
   */
  async sendMessage(phone, content) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <svc_init ver="2.0.0">
    <sms ver="2.0.0">
    <client>
    <id>${messageParams.id}</id>
    <pwd>${messageParams.pwd}/pwd>
    <serviceid>${messageParams.serviceId}</serviceid>
    </client>
    <sms_info>
    <phone>${phone}</phone>
    <content>${content}</content>
    </sms_info>
    </sms>
    </svc_init>`;
    this.ctx.logger.info('【发送短信xml;:】', xml);
    const result = await this.sendXML(xml, 'send');
    if (!result.success) {
      this.ctx.logger.info('【发送短信，返回结果：】', result);
      return result;
    }
    const { response_info } = result.data.svc_result;
    const { gwid, retcode, retmesg } = response_info[0];
    const gwidValue = gwid[0];
    const retcodeValue = retcode[0];
    const retmesgValue = retmesg[0];
    result.success = true;
    result.msg = retcodeMap[retcodeValue];
    result.data = { gwid: gwidValue, retmesg: retmesgValue, retcode: retcodeValue };

    this.ctx.logger.info('【发送短信，返回结果：】', result);

    return result;
  }

  /**
   * 上行短信查询接口
   */
  async sendUpgoingMessage() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <svc_initver="2.0.0">
    <sms ver="2.0.0">
    <client>
    <id>${messageParams.id}</id>
    <pwd>${messageParams.pwd}</pwd>
    </client>
    </sms>
    </svc_init>`;
    const result = await this.sendXML(xml, 'delivery');
    if (!result.success) {
      return result;
    }
    const { itemlist = [], retcode, retmesg } = result.data.svc_result;
    const retcodeValue = retcode[0];
    const retmesgValue = retmesg[0];
    result.success = true;
    result.msg = retcodeMap[retcodeValue];

    const messageData = [];
    if (itemlist.length > 0) {
      itemlist[0].item.forEach(m => {
        messageData.push({
          content: m.content[0],
          simId: m.phone[0],
          // time: m.time[0],
        });
      });
    }
    result.data = { messageData, retmesg: retmesgValue, retcode: retcodeValue };

    return result;
  }
}
module.exports = ChinaMobileService;
