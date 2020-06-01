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
    const { simId, pageNo, pageSize } = request.query;
    // const rule = {
    //   simId: {
    //     type: 'string',
    //   },
    //   pageNo: {
    //     type: 'number',
    //   },
    //   pageSize: {
    //     type: 'number',
    //   },
    // };

    // 校验参数
    // const validateState = ctx.validate(rule, request.query);

    const pageData = await service.sim.getSimPageData({
      pageNo: Number(pageNo),
      pageSize: Number(pageSize),
      simId,
    });
    this.success(pageData, '');
  }

}
module.exports = SimController;
