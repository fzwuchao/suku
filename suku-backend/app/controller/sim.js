'use strict';

const BaseController = require('../core/baseController');

class SimController extends BaseController {
  // 创建
  async save() {
    const { ctx } = this;
    const { request, service } = ctx;
    const { simId, activeMenuName } = request.body;
    let state = null;
    let err = null;
    try {
      state = await service.sim.bulkCreate([{ simId, activeMenuName }]);
    } catch (error) {
      err = error;
      ctx.logger.error(error);
    }

    if (state) {
      this.success(null, '创建成功');
    } else {
      this.fail(null, `${err ? err.message : '创建失败'}`);
    }

  }

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

  async importSims() {
    const { ctx } = this;
    const { request, service, helper } = ctx;
    const { sim } = helper.rules;
    const rule = {
      ...sim([
        'activeMenuId', 'activeMenuName',
        'otherMenuIds', 'userId', 'username',
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
    // TODO: 解析完成后，删除tmp-file/下对应的文件

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
      monthSumFlowThreshold, monthSumFlowThresholdUnit,
      monthVoiceDurationThreshold, monthVoiceDurationThresholdUnit,
      renewPrice,
    } = await service.simCombo.getSimComboById(params.activeMenuId);
    const simList = simIdList.map(simId => {
      return {
        simId,
        activeMenuId: params.activeMenuId,
        activeMenuName: params.activeMenuName,
        otherMenuIds: params.otherMenuIds,
        userId: params.userId,
        username: params.username,
        onelinkId: params.onelinkId,
        onelinkName: params.onelinkName,
        simType: params.simType,
        monthSumFlowThreshold,
        monthSumFlowThresholdUnit,
        monthVoiceDurationThreshold,
        monthVoiceDurationThresholdUnit,
        renewPrice,
      };
    });

    try {
      const result = await service.sim.bulkCreate(simList);
      if (result) {
        // 生成入库记录
        await service.simLogistics.create({
          receiver: params.username,
          receiverId: params.userId,
          total: simList.length,
        });
        this.success('', '导入成功');
      } else {
        this.fail('', '', '导出失败');
      }

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

}
module.exports = SimController;
