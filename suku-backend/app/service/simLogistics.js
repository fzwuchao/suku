'use strict';

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class SimLogisticsService extends BaseService {

  async getSimLogisticsById(id) {
    const attributes = [ 'id', 'flowNo', 'sender', 'receiver', 'total', 'logisticsNo', 'phone', 'address' ];
    const [ simLogistics ] = await this.app.model.SimLogistics.findAll({ attributes,
      where: {
        id,
      },
    });
    return simLogistics;
  }

  async getSimLogisticsPage(query) {
    const attributes = [ 'id', 'flowNo', 'sender', 'receiver', 'total', 'logisticsNo', 'phone', 'address', 'createdAt', 'updatedAt' ];
    const { pageSize, pageNum, flowNo, sender, receiver } = query;
    const Op = this.getOp();
    const where = {};
    if (flowNo) {
      where.flowNo = { [Op.substring]: flowNo };
    }
    if (sender) {
      where.sender = { [Op.substring]: sender };
    }
    if (receiver) {
      where.receiver = { [Op.substring]: receiver };
    }
    const result = await this.findAndCountAll('SimLogistics', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }

  async create(simLogistics) {
    try {
      const curUser = this.getCurUser();
      simLogistics.sender = curUser.name;
      simLogistics.senderId = curUser.id;
      simLogistics.flowNo = SimLogisticsService.FLOW_NO_PREFIX + this.autoOrder(12);
      await this.app.model.SimLogistics.create(simLogistics);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(simLogistics) {
    try {
      await this.app.model.SimLogistics.update(simLogistics, { where: { id: simLogistics.id } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async bulkUpdate(ids, value, oper) {
    try {
      const values = {};
      values[oper] = value;
      await this.app.model.SimLogistics.update(values, { where: { id: { [this.getOp().in]: ids } } });
    } catch (e) {
      return false;
    }
    return true;
  }

}

SimLogisticsService.FLOW_NO_PREFIX = 'SLTS';

module.exports = SimLogisticsService;
