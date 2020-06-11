'use strict';

const BaseService = require('../core/baseService');

const CHINA_MOBILE_HOST = 'https://api.iot.10086.cn/v5';
const commonParams = {
  transid: '',
  token: '',
};
const url = {
  get_token: '/ec/get/token',
  sim_base_info: '/ec/query/sim-basic-info',
  change_sim_status: '/ec/change/sim-status',
  change_sim_status_batch: '/ec/change/sim-status/batch',
};

class ChinaMobileService extends BaseService {
  async fetchData(url, data) {
    return await this.ctx.curl(`${CHINA_MOBILE_HOST}${url}`, { data });
  }

  getResult(res) {
    if (res.status === '0') {
      return res.result;
    }
    this.ctx.logger.error(res.message);
    return [];
  }

  /**
   * CMIOT_API25000-认证服务接口
   * token 过期时间为 1 小时
   */
  async getToken() {
    const data = {
      appid: '',
      password: '',
      transid: '',
    };
    const res = await this.fetchData(url.get_token, data);
    const result = this.getResult(res);
    return result.length > 0 ? result[0].token : null;
  }

  /**
   * CMIOT_API23S00-单卡基本信息查询
   * 查询物联卡码号信息、开卡时间、首次激活时间
   * @return { msisdn, imsi, iccid, activeDate, openDate} - 物联卡号码, 国际移动用户识别码, IC 卡的唯一识别号码, 激活日期（首次）, 开卡时间
   */
  async querySimBasicInfo() {
    const data = {
      ...commonParams,
      msisdn: '',
      iccid: '',
      imsi: '',
    };

    const res = await this.fetchData(url.sim_base_info, data);
    const result = this.getResult(res);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * CMIOT_API23S03-单卡状态变更
   */
  async changeSimStatus() {
    const data = {
      ...commonParams,
      msisdn: '',
      iccid: '',
      imsi: '',
      operType: '',
    };

    const res = await this.fetchData(url.change_sim_status, data);
    const result = this.getResult(res);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * CMIOT_API23S06-物联卡状态变更批量办理
   */
  async changeSimStatusBatch() {
    const data = {
      ...commonParams,
      msisdns: '',
      reason: '',
      operType: '',
    };

    const res = await this.fetchData(url.change_sim_status_batch, data);
    const result = this.getResult(res);
    return result.length > 0 ? result[0] : null;
  }
}

module.exports = ChinaMobileService;
