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
      pageNo: {
        type: 'int',
      },
      pageSize: {
        type: 'int',
      },
    };

    // 校验参数，会将request.query中的参数的数据类型，按rule进行转换
    ctx.validate(rule, request.query);
    const { simId, pageNo, pageSize } = request.query;
    const pageData = await service.sim.getSimPageData({
      pageNo,
      pageSize,
      simId,
    });
    this.success(pageData, '');
  }

}
module.exports = SimController;
