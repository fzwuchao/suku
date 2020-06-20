'use strict';


const _ = require('lodash');

const BaseController = require('../core/baseController');

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

    const params = Object.keys(rule).reduce((acc, cur) => {
      if (cur in request.query || cur in request.queries) {
        acc[cur] = rule[cur].type.includes('array') ? request.queries[`${cur}`] : request.query[cur];
      }
      return acc;
    }, {});

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

    const params = Object.keys(rule).reduce((acc, cur) => {
      if (cur in request.query || cur in request.queries) {
        acc[cur] = rule[cur].type.includes('array') ? request.queries[`${cur}`] : request.query[cur];
      }
      return acc;
    }, {});

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
   * 头字段包括: MSISDN，ICCID
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
      ]),
    };
    const params = { ...request.body };
    ctx.validate(rule, params);

    const simExcelHeadField = [ 'MSISDN', 'ICCID' ];
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
    const simList = sheetData.map(item => {
      const simId = item[simExcelHeadField[0]];
      const iccid = item[simExcelHeadField[1]];
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
        monthFlow,
        monthVoice,
        renewPrice,
        monthRent,
      };
    });

    try {
      await service.sim.bulkCreate(simList);
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
    ctx.validate(rule, request.query);
    const { simId } = request.query;
    const result = await service.sim.getSimBySimId(simId);
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
      ...sim([ 'simId', 'simType' ]),
    };
    ctx.validate(rule, request.query);
    const { simId, simType } = request.query;

    await ctx.service.sim.syncUpdate(simId, simType);
    this.success('', '同步更新完成');
  }

  async update() {
    const ctx = this.ctx;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim(),
    };
    ctx.validate(rule, request.body);
    const { simId, otherComboIds, overdueTime, privateMoney } = request.body;
    await service.sim.updateBySimId({ otherComboIds, overdueTime, privateMoney }, simId);
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
    const { simIds, otherComboIds, cardStatus, voiceServStatus, privateMoney, flowServStatus, uid, uname } = request.body;
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
      data.flowServStatus = flowServStatus === 1 ? 2 : 1;
      result = await service.sim.updateFlowServStatus(simIds[0], flowServStatus);
      if (result.error) {
        this.fail(result.status, '', result.message);
        return;
      }
    }

    // 停/复语音
    if (!_.isNil(voiceServStatus)) {
      data.voiceServStatus = voiceServStatus === 1 ? 2 : 1;
      result = await service.sim.updateVoiceServStatus(simIds[0], voiceServStatus);
      if (result.error) {
        this.fail(result.status, '', result.message);
        return;
      }
    }
    // 续费增价
    if (!_.isNil(privateMoney)) data.privateMoney = privateMoney;

    if (!_.isNil(uid)) {
      data.uid = uid;
      data.uname = uname;
    }

    await service.sim.batchUpdateBySimIds(data, simIds);
    this.success(null, '批量更新成功');
  }
}
module.exports = SimController;
