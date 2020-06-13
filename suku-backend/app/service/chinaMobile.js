'use strict';

const moment = require('moment');
const BaseService = require('../core/baseService');

const commonParams = {
  transid: '',
  token: '',
};

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

const url = {
  get_token: '/ec/get/token',
  sim_base_info: '/ec/query/sim-basic-info',
  change_sim_status: '/ec/change/sim-status',
  change_sim_status_batch: '/ec/change/sim-status/batch',
};

class ChinaMobileService extends BaseService {
  async fetchData(url, data, options) {
    return await this.ctx.curl(url, {
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

    const res = await this.fetchData(`${hostAndVer}${url.get_token}`, {
      appid,
      password,
      transid: `${appid}${getNowStr()}${getIndexStr()}`,
    });
    const result = this.getResult(res);
    if (result.length > 0) {
      token = result[0].token;
    }

    const pipeline = await this.app.redis.pipeline();
    await pipeline.set(nameKey, token).pexpire(nameKey, EXPIRE_TIME).exec((err, results)=> {});

    return token;
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
