'use strict';

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class OnelinkPlatformService extends BaseService {


  async getOnelinkByNameKey(nameKey) {
    const attributes = [ 'id', 'name', 'appId', 'apiHost', 'apiVersion', 'nameKey', 'status' ];
    const [ onlinkPlatform ] = await this.app.model.OnelinkPlatform.findAll({ attributes,
      where: {
        nameKey,
      },
    });
    return onlinkPlatform;
  }

  async getOnelinkById(id) {
    const attributes = [ 'id', 'name', 'appId', 'secretKey', 'apiHost', 'apiVersion', 'loginName', 'loginPws', 'nameKey', 'status' ];
    const [ onlinkPlatform ] = await this.app.model.OnelinkPlatform.findAll({ attributes,
      where: {
        id,
      },
    });
    return onlinkPlatform;
  }

  async getAllOnelink() {
    const attributes = [ 'id', 'name' ];
    const onlinkPlatform = await this.app.model.OnelinkPlatform.findAll({ attributes,
      where: {
        status: 1,
      },
    });
    return onlinkPlatform;
  }

  async getAllOnelinkHasStop() {
    const attributes = [ 'id', 'name' ];
    const onlinkPlatform = await this.app.model.OnelinkPlatform.findAll({ attributes,
    });
    return onlinkPlatform;
  }

  async getAllOnelinkDesc() {
    const attributes = [ 'id', 'name', 'appId', 'apiHost', 'apiVersion', 'nameKey', 'status', 'secretKey' ];
    const onlinkPlatform = await this.app.model.OnelinkPlatform.findAll({ attributes,
      where: {
        status: 1,
      },
    });
    return onlinkPlatform;
  }

  async getOnelinkPage(pageSize, pageNum) {
    const attributes = [ 'id', 'name', 'appId', 'apiHost', 'apiVersion', 'loginName', 'loginPws', 'nameKey', 'status', 'createdAt', 'updatedAt' ];
    const result = await this.findAndCountAll('OnelinkPlatform', pageSize, pageNum, {
      attributes,
    });
    return result;
  }

  async create(onelink) {
    try {
      await this.app.model.OnelinkPlatform.create(onelink);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(onelink) {
    try {
      await this.app.model.OnelinkPlatform.update(onelink, { where: { id: onelink.id } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async bulkUpdate(ids, value, oper) {
    try {
      const values = {};
      values[oper] = value;
      await this.app.model.OnelinkPlatform.update(values, { where: { id: { [this.getOp().in]: ids } } });
    } catch (e) {
      return false;
    }
    return true;
  }

}

module.exports = OnelinkPlatformService;
