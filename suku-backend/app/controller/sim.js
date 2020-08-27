'use strict';


const _ = require('lodash');
const moment = require('moment');

const BaseController = require('../core/baseController');
const { SERV_STATUS, SERV_OP_SINGLE, LIMT_OPTY, SIM_FLOW_SERV_STATUS, COMBO_TYPE, SIM_TYPE } = require('../extend/constant')();
const calc = require('calculatorjs');
const activeComboOldToNewMap = [{
  old: [ '30M季度卡' ],
  new: '30M季度卡',
}, {
  old: [ '30M半年卡' ],
  new: '30M半年卡',
}, {
  old: [ '30M年卡' ],
  new: '30M年卡',
}, {
  old: [ '100M季度卡' ],
  new: '100M季度卡',
}, {
  old: [ '100M半年卡' ],
  new: '100M半年卡',
}, {
  old: [ '100M年卡' ],
  new: '100M年卡',
}, {
  old: [ '3G年卡' ],
  new: '3G年卡',
}, {
  old: [ '2个月30M卡' ],
  new: '2个月30M卡',
}, {
  old: [ '100M年卡 DGZZ' ],
  new: '100M年卡 DGZZ',
}, {
  old: [ '30M三年年卡' ],
  new: '30M三年年卡',
}, {
  old: [ '2个月100M卡' ],
  new: '2个月100M',
}, {
  old: [ '季度特惠包', '半年畅享包', '一年实惠包' ],
  new: '200M+200min',
}, {
  old: [ '6个月36元每月30' ],
  new: '6个月30M',
}, {
  old: [ '500分钟/1G' ],
  new: '4G 1G+500MIN',
}, {
  old: [ '30M/30min月租套餐' ],
  new: '30M/30min',
}, {
  old: [ '88元每月3G' ],
  new: '88元每月3G',
}, {
  old: [ '60M半年卡' ],
  new: '60M半年',
}];
class SimController extends BaseController {
  // 查询
  async search() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { pageRules, sim } = helper.rules;

    const rule = {
      ...sim(),
      ...pageRules,
    };

    // const params = Object.keys(rule).reduce((acc, cur) => {
    //   if (cur in request.query || cur in request.queries) {
    //     acc[cur] = rule[cur].type.includes('array') ? request.queries[`${cur}`] : request.query[cur];
    //   }
    //   return acc;
    // }, {});
    const params = request.body;
    ctx.validate(rule, params);
    const pageData = await service.sim.getSimPageData(params);
    this.success(pageData, '');
  }

  async exportExcel() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;

    const rule = {
      ...sim(),
    };

    // const params = Object.keys(rule).reduce((acc, cur) => {
    //   if (cur in request.query || cur in request.queries) {
    //     acc[cur] = rule[cur].type.includes('array') ? request.queries[`${cur}`] : request.query[cur];
    //   }
    //   return acc;
    // }, {});
    const params = request.body;
    ctx.validate(rule, params);
    const excelSimData = await service.sim.getSimDataForExcel(params, params.simType === 'B');
    const jsonExcel = JSON.parse(JSON.stringify(excelSimData, null, 2));
    const buffer = await service.sheet.generateWorkbookBuffer(jsonExcel);
    // application/octet-stream application/vnd.openxmlformats application/msexcel
    this.ctx.set('Content-Type', 'application/msexcel');
    this.ctx.set('Content-disposition', 'attachment; filename=1.xlsx');
    // this.success(buffer, '');
    this.ctx.body = buffer;
  }

  /**
   * 导入excel文件
   * 头字段包括: 'sim_id', 'iccid', 'overdue_time', 'private_money', 'month_overlap_flow'
   */
  async importSimsWithHeadField() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([
        'activeComboId', 'activeComboName',
        'otherComboIds', 'uid', 'uname',
        'onelinkId', 'onelinkName',
        'simType',
        'filepath',
        'netStatus',
      ]),
    };
    const params = { ...request.body };
    ctx.validate(rule, params);

    const simExcelHeadField = [ 'sim_id', 'iccid', 'overdue_time', 'private_money', 'month_overlap_flow' ];
    const result = await service.sheet.parseFileWithHeadField(params.filepath);

    if (!result.parseSuccess) {
      this.fail(null, null, result.msg);
      return;
    }

    const sheetData = result.sheetData;
    const simIdList = sheetData.map(item => item[simExcelHeadField[0]]);
    const mapSimIdToCount = {};
    // 表中的sim卡号验重
    simIdList.forEach(simId => {
      if (!mapSimIdToCount[simId]) {
        mapSimIdToCount[simId] = 1;
      } else {
        mapSimIdToCount[simId] += mapSimIdToCount[simId];
      }
    });
    const repeatSimIdsInFile = Object.keys(mapSimIdToCount).filter(simId => mapSimIdToCount[simId] > 1);
    if (repeatSimIdsInFile.length > 0) {
      ctx.logger.error(`【导入的表中，sim卡号存在重复的】: ${repeatSimIdsInFile}`);
      this.fail(null, repeatSimIdsInFile, '导入的表中，sim卡号存在重复的');
      return;
    }

    const repeatSimIdList = await service.sim.getRepeatSimIds(simIdList);
    // 表格中的sim卡号与数据库中的验重
    if (repeatSimIdList.length > 0) {
      const repeatIds = repeatSimIdList.map(item => item.simId);
      ctx.logger.error(`【数据库中，sim卡号已存在】: ${repeatIds}`);
      this.fail(null, repeatIds, '数据库中，sim卡号已存在');
      return;
    }
    // 激话套餐的流量、语音时长、续费价格
    const {
      monthFlow,
      monthVoice,
      renewPrice,
      monthRent,
    } = await service.simCombo.getSimComboById(params.activeComboId);
    const simList = sheetData.map(item => {
      const simId = item[simExcelHeadField[0]];
      const iccid = item[simExcelHeadField[1]];
      const overdueTime = item[simExcelHeadField[2]] ? new Date(item[simExcelHeadField[2]]) : null;
      const privateMoney = item[simExcelHeadField[3]] ? item[simExcelHeadField[3]] : null;
      const monthOverlapFlow = item[simExcelHeadField[4]] ? item[simExcelHeadField[4]] : 0;
      return {
        simId,
        iccid,
        activeComboId: params.activeComboId,
        activeComboName: params.activeComboName,
        otherComboIds: params.otherComboIds,
        uid: params.uid,
        uname: params.uname,
        onelinkId: params.onelinkId,
        onelinkName: params.onelinkName,
        simType: params.simType,
        virtualMult: params.virtualMult,
        netStatus: params.netStatus,
        monthFlow,
        monthVoice,
        renewPrice,
        monthRent,
        overdueTime,
        privateMoney,
        monthOverlapFlow,
      };
    });

    try {
      await service.sim.bulkCreate(simList);
      // for (let i = 0; i < simList.length; i++) {
        // const item = simList[i];
        // const operType = LIMT_OPTY.ADD;
        // const limtValue = calc(`${item.monthFlow}/${item.virtualMult}`).toFixed(3);
        // await service.chinaMobile.configLimtValue(operType, limtValue, item.simId);
      // }
      // 在表中生成数据后，删除tmp-file/下对应的文件
      await service.sheet.removeFile(params.filepath);

      // 生成入库记录
      await service.simLogistics.create({
        receiver: params.uname,
        receiverId: params.uid,
        total: simList.length,
      });
      this.success('', '导入成功');

    } catch (error) {
      this.ctx.logger.error(error);
      this.fail('', '', error.message);
    }
  }

  /**
   * 导入excel文件（用于迁移）
   * 头字段包括: 'sim_id', 'iccid', 'overdue_time', 'private_money', 'month_overlap_flow', 'name', 'menu_name'
   * name是旧平台的用户名，对应新平台的user的name
   * menu_name是旧平台的激活套餐名，根据映射关系，对应新平台sim_combo的name
   */
  async importSimsWithHeadFieldForTransfer() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([
        // 'activeComboId', 'activeComboName',
        // 'otherComboIds', 'uid', 'uname',
        'onelinkId', 'onelinkName',
        'simType',
        'filepath',
      ]),
    };
    const params = { ...request.body };
    ctx.validate(rule, params);

    const simExcelHeadField = [ 'sim_id', 'iccid', 'overdue_time', 'private_money', 'month_overlap_flow', 'name', 'menu_name' ];
    const result = await service.sheet.parseFileWithHeadField(params.filepath);

    if (!result.parseSuccess) {
      this.fail(null, null, result.msg);
      return;
    }

    const sheetData = result.sheetData;
    const simIdList = sheetData.map(item => item[simExcelHeadField[0]]);
    const mapSimIdToCount = {};
    // 表中的sim卡号验重
    simIdList.forEach(simId => {
      if (!mapSimIdToCount[simId]) {
        mapSimIdToCount[simId] = 1;
      } else {
        mapSimIdToCount[simId] += mapSimIdToCount[simId];
      }
    });
    const repeatSimIdsInFile = Object.keys(mapSimIdToCount).filter(simId => mapSimIdToCount[simId] > 1);
    if (repeatSimIdsInFile.length > 0) {
      ctx.logger.error(`【导入的表中，sim卡号存在重复的】: ${repeatSimIdsInFile}`);
      this.fail(null, repeatSimIdsInFile, '导入的表中，sim卡号存在重复的');
      return;
    }

    const repeatSimIdList = await service.sim.getRepeatSimIds(simIdList);
    // 表格中的sim卡号与数据库中的验重
    if (repeatSimIdList.length > 0) {
      const repeatIds = repeatSimIdList.map(item => item.simId);
      ctx.logger.error(`【数据库中，sim卡号已存在】: ${repeatIds}`);
      this.fail(null, repeatIds, '数据库中，sim卡号已存在');
      return;
    }

    const users = await service.user.getAllUsers();
    if (users && users.length === 0 || !users) {
      this.fail(null, null, '没有用户');
      return;
    }
    // 激活套餐
    const activeComboList = await service.simCombo.getSimComboByComboType(COMBO_TYPE.ACTIVE);
    const increaseComboList = await service.simCombo.getSimComboByComboType(COMBO_TYPE.INCREASE);

    if (activeComboList && activeComboList.length === 0 || !activeComboList) {
      this.fail(null, null, '没有激活套餐');
      return;
    }

    const nameToActiveComboMap = activeComboList.reduce((acc, cur) => {
      acc[cur.name] = {
        activeComboId: cur.id,
        activeComboName: cur.name,
        monthFlow: cur.monthFlow,
        monthVoice: cur.monthVoice,
        renewPrice: cur.renewPrice,
        monthRent: cur.monthRent,
      };
      return acc;
    }, {});

    if (increaseComboList && increaseComboList.length === 0 || !increaseComboList) {
      this.fail(null, null, '没有叠加套餐');
      return;
    }

    let otherComboIds = '';
    // 被叫卡只选流量叠加套餐
    if (params.simType === SIM_TYPE.CALLED) {
      otherComboIds = increaseComboList.filter(item => item.name === '流量叠加套餐')[0].id;
    } else {
      otherComboIds = increaseComboList.map(item => item.id).join(',');
    }

    const userMap = users.reduce((acc, cur) => {
      acc[cur.dataValues.key] = { uid: cur.dataValues.value, uname: cur.dataValues.key };
      return acc;
    }, {});
    const activeComboNameToComboMap = activeComboOldToNewMap.reduce((acc, cur) => {
      cur.old.forEach(item => {
        acc[item] = cur.new;
      });
      return acc;
    }, {});

    const simList = sheetData.map(item => {
      const simId = item[simExcelHeadField[0]];
      const iccid = item[simExcelHeadField[1]];
      const overdueTime = item[simExcelHeadField[2]] ? new Date(item[simExcelHeadField[2]]) : null;
      const privateMoney = item[simExcelHeadField[3]] ? item[simExcelHeadField[3]] : 0;
      const monthOverlapFlow = item[simExcelHeadField[4]] ? item[simExcelHeadField[4]] : 0;
      const uname = item[simExcelHeadField[5]];
      const user = userMap[uname];
      const activeComboName = activeComboNameToComboMap[item[simExcelHeadField[6]]];
      const activeCombo = nameToActiveComboMap[activeComboName];
      return {
        simId,
        iccid,
        // activeComboId: params.activeComboId,
        // activeComboName: params.activeComboName,
        ...activeCombo,
        otherComboIds,
        // uid: params.uid,
        // uname: params.uname,
        ...user,
        onelinkId: params.onelinkId,
        onelinkName: params.onelinkName,
        simType: params.simType,
        virtualMult: params.virtualMult,
        // monthFlow,
        // monthVoice,
        // renewPrice,
        // monthRent,
        overdueTime,
        privateMoney,
        monthOverlapFlow,
      };
    });

    try {
      await service.sim.bulkCreate(simList);
      // for (let i = 0; i < simList.length; i++) {
      //   const item = simList[i];
      //   const operType = LIMT_OPTY.ADD;
      //   const limtValue = calc(`${item.monthFlow}/${item.virtualMult}`).toFixed(3);
      //   await service.chinaMobile.configLimtValue(operType, limtValue, item.simId);
      // }
      // 在表中生成数据后，删除tmp-file/下对应的文件
      await service.sheet.removeFile(params.filepath);

      // 生成入库记录
      await service.simLogistics.create({
        receiver: '旧平台卡迁移',
        total: simList.length,
      });
      this.success('', '导入成功');

    } catch (error) {
      this.ctx.logger.error(error);
      this.fail('', '', error.message);
    }
  }

  /**
   * 导入excel文件
   * 文件格式：第一列是simId，没有头字段
   */
  async importSims() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([
        'activeComboId', 'activeComboName',
        'otherComboIds', 'uid', 'uname',
        'onelinkId', 'onelinkName',
        'simType',
        'filepath',
      ]),
    };
    const params = { ...request.body };
    ctx.validate(rule, params);

    const result = await service.sheet.parseSimIdFile(params.filepath);

    if (!result.parseSuccess) {
      this.fail(null, null, result.msg);
      return;
    }

    const simIdList = result.sheetData;

    const mapSimIdToCount = {};
    // 表中的sim卡号验重
    simIdList.forEach(simId => {
      if (!mapSimIdToCount[simId]) {
        mapSimIdToCount[simId] = 1;
      } else {
        mapSimIdToCount[simId] += mapSimIdToCount[simId];
      }
    });
    const repeatSimIdsInFile = Object.keys(mapSimIdToCount).filter(simId => mapSimIdToCount[simId] > 1);
    if (repeatSimIdsInFile.length > 0) {
      ctx.logger.error(`【表中，sim卡号存在重复的】: ${repeatSimIdsInFile}`);
      this.fail(null, repeatSimIdsInFile, '表中，sim卡号存在重复的');
      return;
    }

    const repeatSimIdList = await service.sim.getRepeatSimIds(simIdList);
    // 表格中的sim卡号与数据库中的验重
    if (repeatSimIdList.length > 0) {
      const repeatIds = repeatSimIdList.map(item => item.simId);
      ctx.logger.error(`【数据库中，sim卡号已存在】: ${repeatIds}`);
      this.fail(null, repeatIds, '数据库中，sim卡号已存在');
      return;
    }
    // 激话套餐的流量、语音时长、续费价格
    const {
      monthFlow,
      monthVoice,
      renewPrice,
      monthRent,
    } = await service.simCombo.getSimComboById(params.activeComboId);
    const simList = simIdList.map(simId => {
      return {
        simId,
        activeComboId: params.activeComboId,
        activeComboName: params.activeComboName,
        otherComboIds: params.otherComboIds,
        uid: params.uid,
        uname: params.uname,
        onelinkId: params.onelinkId,
        onelinkName: params.onelinkName,
        simType: params.simType,
        virtualMult: params.virtualMult,
        monthFlow,
        monthVoice,
        renewPrice,
        monthRent,
      };
    });

    try {
      await service.sim.bulkCreate(simList);
      // 解析完成后，删除tmp-file/下对应的文件
      await service.sheet.removeFile(params.filepath);
      // 生成入库记录
      await service.simLogistics.create({
        receiver: params.uname,
        receiverId: params.uid,
        total: simList.length,
      });
      this.success('', '导入成功');
    } catch (error) {
      this.fail('', '', error.message);
    }
  }

  async getSim() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    const { simIdOrIccid, simId } = request.query;
    const params = {};
    if (simId) {
      params.simId = simId;
    } else if (simIdOrIccid) {
      const len = simIdOrIccid.length;
      if (len === 11 || len === 13) {
        params.simId = simIdOrIccid;
      } else if (len === 20) {
        params.iccid = simIdOrIccid;
      }
    }

    ctx.validate(rule, params);
    const simData = await service.sim.getSimBySimIdOrIccid(params);
    if (!simData) {
      this.fail(null, null, '此卡号不是本平台的卡！');
      return;
    }
    const sId = simData.simId;
    const openStatus = await service.chinaMobile.queryOnOffStatus(sId);
    await service.sim.updateBySimId({ openStatus }, sId);
    const result = await service.sim.getSimBySimId(sId);
    this.success(result, '');
  }

  /**
   * 同步更新
   * 都需要同步的字段有：状态信息、开关机状态、通信功能开通、流量累计使用量
   * 主叫卡还需要同步的字段：语音累计使用量
   */
  async syncUpdate() {
    const ctx = this.ctx;
    const { request, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([ 'simId', 'simType', 'activeComboId' ]),
    };
    ctx.validate(rule, request.query);
    const { simId } = request.query;
    const simO = await ctx.service.sim.getSimBySimId(simId)
    await ctx.service.sim.syncUpdate(simO, false, false, '[controller->sim->syncUpdate]');
    this.success('', '同步更新完成');
  }

  /**
   * 迁移同步
   * 都需要同步的字段有：状态信息、开关机状态、通信功能开通、流量累计使用量
   * 主叫卡还需要同步的字段：语音累计使用量
   */
  async migrationSyncUpdate() {
    const ctx = this.ctx;
    const { request, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([ 'simType' ]),
    };
    ctx.validate(rule, request.query);
    const { simType } = request.query;

    // await ctx.service.sim.migrationSyncUpdate(simType);
    // await ctx.service.schedule.monthCalculate();
    // await ctx.service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.OFF, '((month_used_flow*virtual_mult) >= (month_overlap_flow+month_flow) and card_status=2)');
    // await ctx.service.schedule.syncUpdateBatch();
    this.success('', '同步更新完成');
  }

  /**
   * 获取iccid
   * 都需要同步的字段有：状态信息、开关机状态、通信功能开通、流量累计使用量
   * 主叫卡还需要同步的字段：语音累计使用量
   */
  async iccidSyncUpdate() {
    const ctx = this.ctx;
    const { request, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([ 'simType' ]),
    };
    ctx.validate(rule, request.query);
    const { simType } = request.query;

    // await ctx.service.sim.migrationSyncUpdate(simType);
    // await ctx.service.schedule.monthCalculate();
    // await ctx.service.sim.updateFlowServStatusBatch(SIM_FLOW_SERV_STATUS.OFF, '((month_used_flow*virtual_mult) >= (month_overlap_flow+month_flow) and card_status=2)');
    // await ctx.service.schedule.syncUpdateBatch();
    await ctx.service.sim.iccidSyncUpdate(simType);
    this.success('', '同步更新完成');
  }

  /**
   * 一键设置卡阀值
   */
  async configLimtValue() {
    const ctx = this.ctx;
    const { request, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([ 'simType' ]),
    };
    ctx.validate(rule, request.query);
    const { simType } = request.query;

    await ctx.service.sim.configLimtValue(simType);
    this.success('', '同步更新完成');
  }

  /**
   * 单卡设置阀值
   */
  async configLimtValueBySimId() {
    const ctx = this.ctx;
    const { request, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([ 'simId' ]),
    };
    ctx.validate(rule, request.query);
    const { simId } = request.query;
    const simO = await ctx.service.sim.getSimBySimId(simId)
    await ctx.service.sim.configLimtValueBySim(simO);
    this.success('', '设置完成');
  }

  async update() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    ctx.validate(rule, request.body);
    const { simId, otherComboIds, overdueTime, privateMoney, virtualMult } = request.body;
    await service.sim.updateBySimId({ otherComboIds, overdueTime, privateMoney, virtualMult }, simId);
    const result = await service.sim.getSimBySimId(simId);
    const operType = LIMT_OPTY.UPADTE;
    const limtValue = calc(`${result.monthFlow}/${result.virtualMult}`).toFixed(3);
    await service.chinaMobile.configLimtValue(operType, limtValue, result.simId, result.netStatus);
    this.success(null, '更新成功');
  }

  async batchUpdate() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    ctx.validate(rule, request.body);
    const { simIds, otherComboIds, cardStatus, voiceServStatus, msgServStatus, privateMoney, flowServStatus, uid, uname } = request.body;
    const data = {};
    let result = null;
    // TODO: 在调移动平台的接口前，检验这些卡号是同一个onelinkId
    // 套餐
    if (!_.isNil(otherComboIds)) data.otherComboIds = otherComboIds;
    // 停/复机
    if (!_.isNil(cardStatus) && !_.isNil(simIds)) {
      data.cardStatus = cardStatus;
      result = await service.sim.updateCardStatus(simIds[0], cardStatus);
      if (result.error) {
        this.fail(result.status, '', result.message);
        return;
      }
    }

    // 停/复数据
    if (!_.isNil(flowServStatus)) {
      data.flowServStatus = flowServStatus === SERV_OP_SINGLE.OFF ? SERV_STATUS.OFF : SERV_STATUS.ON;
      result = await service.sim.updateFlowServStatus(simIds[0], flowServStatus);
      if (result.error) {
        this.fail(result.status, '', result.message);
        return;
      }
    }

    // 停/复语音
    if (!_.isNil(voiceServStatus)) {
      data.voiceServStatus = voiceServStatus === SERV_OP_SINGLE.OFF ? SERV_STATUS.OFF : SERV_STATUS.ON;
      result = await service.sim.updateVoiceServStatus(simIds[0], voiceServStatus);
      if (result.error) {
        this.fail(result.status, '', result.message);
        return;
      }
    }
    // 停/复短信
    if (!_.isNil(msgServStatus)) {
      data.msgServStatus = msgServStatus === SERV_OP_SINGLE.OFF ? SERV_STATUS.OFF : SERV_STATUS.ON;
      result = await service.sim.updateMsgServStatus(simIds[0], msgServStatus);
      if (result.error) {
        this.fail(result.status, '', result.message);
        return;
      }
    }

    // 续费增价
    if (!_.isNil(privateMoney)) data.privateMoney = privateMoney;

    // 转让
    if (!_.isNil(uid)) {
      const errorMsg = await this.isAllMySims(simIds);
      if (errorMsg) {
        this.fail('', '', errorMsg);
        return;
      }
      data.uid = uid;
      data.uname = uname;
    }

    await service.sim.batchUpdateBySimIds(data, simIds);
    this.success(null, '批量更新成功');
  }

  async changeComboBySimNumOrSimRange() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    ctx.validate(rule, request.body);
    const { simNum, simRange, otherComboIds, simType } = request.body;
    if (!simNum && !simRange) {
      this.fail(null, null, '传入的卡号或卡段值为空');
      return;
    }

    let simIds = [];
    let flag = 'simNum';
    if (simNum) {
      simIds = simNum.split(',');
      flag = 'simNum';
    }
    if (simRange) {
      simIds = simRange;
      flag = 'simRange';
    }
    const result = await service.sim.getSimBySimIdsNonSimType(flag, simIds, simType);
    if (result.length > 0) {
      const simIdsNonSimType = result.map(item => item.dataValues[ 'simId' ]).join(',');
      this.fail(null, simIdsNonSimType, `卡中包含非${simType}类型的卡`);
      return;
    }

    const data = { otherComboIds };
    let isSuccess = false;
    if (simNum) {
      isSuccess = await service.sim.batchUpdateBySimIds(data, simNum.split(','));
    }
    if (simRange) {
      isSuccess = await service.sim.batchUpdateByLikeSimId(data, simRange);
    }
    isSuccess ? this.success(null, '批量更换套餐成功') : this.fail(null, null, '批量更换套餐失败');

  }

  async changeActiveComboBySimNumOrSimRange() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    ctx.validate(rule, request.body);
    const { simNum, simRange, activeComboId, activeComboName, simType } = request.body;
    if (!simNum && !simRange) {
      this.fail(null, null, '传入的卡号或卡段值为空');
      return;
    }
    let simIds = [];
    let flag = 'simNum';
    if (simNum) {
      simIds = simNum.split(',');
      flag = 'simNum';
    }
    if (simRange) {
      simIds = simRange;
      flag = 'simRange';
    }
    const result = await service.sim.getSimBySimIdsNonSimType(flag, simIds, simType);
    if (result.length > 0) {
      const simIdsNonSimType = result.map(item => item.dataValues[ 'simId' ]).join(',');
      this.fail(null, simIdsNonSimType, `卡中包含非${simType}类型的卡`);
      return;
    }
    const {
      monthFlow,
      monthVoice,
      renewPrice,
      monthRent,
    } = await service.simCombo.getSimComboById(activeComboId);

    const data = { activeComboId, activeComboName, monthFlow, monthVoice, renewPrice, monthRent };
    let isSuccess = false;
    if (simNum) {
      isSuccess = await service.sim.batchUpdateBySimIds(data, simIds);
    }
    if (simRange) {
      isSuccess = await service.sim.batchUpdateByLikeSimId(data, simIds);
    }
    isSuccess ? this.success(null, '批量更换激活套餐成功') : this.fail(null, null, '批量更换激活套餐失败');
  }

  async changeUserBySimNumOrSimRange() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    ctx.validate(rule, request.body);
    const { simNum, simRange, uid, uname } = request.body;
    if (!simNum && !simRange) {
      this.fail(null, null, '传入的卡号或卡段值为空');
      return;
    }
    const data = { uid, uname };
    let isSuccess = false;
    let errorMsg = null;
    if (simNum) {
      errorMsg = await this.isAllMySims(simNum.split(','));
      if (errorMsg) {
        this.fail('', '', errorMsg);
        return;
      }
      isSuccess = await service.sim.batchUpdateBySimIds(data, simNum.split(','));
    }
    if (simRange) {
      errorMsg = await this.isAllMySims(simRange, 'simRange');
      if (errorMsg) {
        this.fail('', '', errorMsg);
        return;
      }
      isSuccess = await service.sim.batchUpdateByLikeSimId(data, simRange);
    }
    isSuccess ? this.success(null, '批量更换用户成功') : this.fail(null, null, '批量更换用户失败');
  }

  async isAllMySims(simIds, type) {
    const isAllMySims = await this.ctx.service.sim.checkAllMySims(simIds, type);
    let errorMsg = null;
    if (!isAllMySims) {
      errorMsg = '只有自己名下的卡才能转让';
    }
    return errorMsg;
  }
}
module.exports = SimController;
