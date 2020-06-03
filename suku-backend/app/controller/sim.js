'use strict';

const BaseController = require('../core/base_controller');

class SimController extends BaseController {
  // 创建
  async save() {
    const { ctx } = this;
    const { request, service } = ctx;
    const { simId } = request.body;
    const state = await service.sim.bulkCreate([{ simId }]);

    if (state) {
      this.success(null, '创建成功');
    } else {
      this.fail(null, '创建失败');
    }

  }

  // 查询
  async search() {
    const { ctx } = this;
    const { request, service } = ctx;

    const rule = {
      simId: {
        type: 'string?', // 加问号表示这个参数非必要
      },
      simIdRange: {
        type: 'array?',
        itemType: 'string',
      },
      username: {
        type: 'string?',
      },
      netStatus: {
        type: 'int?',
      },
      isActive: {
        type: 'int?',
      },
      simType: {
        type: 'string?',
      },
      activeMenuName: {
        type: 'string?',
      },
      pageNum: {
        type: 'int',
      },
      pageSize: {
        type: 'int',
      },
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

}
module.exports = SimController;
