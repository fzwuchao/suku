'use strict';

const BaseService = require('../core/baseService');
// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';
const {WRITELIST_STATUS} = require('../extend/constant')();
class WriteListService extends BaseService {

  async getWriteListPage(query) {
    const attributes = [ 'id', 'simId', 'uname', 'phone', 'createdAt' ];
    const { pageSize, pageNum, status, simId, uid } = query;
    const Op = this.getOp();
    const where = {};

    if (simId) {
      where.simId = { [Op.substring]: simId };
    }
    if (uid) {
      where.uid = uid;
    } else {
      const curUser = this.getCurUser();
      let ids = [];
      if (curUser.roleLevel <= 1) {
        ids = await this.ctx.service.user.getAllUserIds();
      } else {
        ids = await this.ctx.service.user.getAllUserIdsByPid([ curUser.id ]);
      }
      where.uid = {
        [Op.in]: ids,
      };
    }
    if (status !== undefined) {
      where.status = status;
    }
    const result = await this.findAndCountAll('WriteList', pageSize, pageNum, {
      attributes,
      where,
    });
    return result;
  }

  async getWriteListBySimIdInCHM(simId) {
    const {service} = this.ctx;
    const res = await service.chinaMobile.queryMemberVoiceWhitelist(simId);
    const writeList = (res[0] || {}).memVoiceWhiteList
    for(let i=0; i<writeList.length; i++) {
      const item = writeList[i];
      let write = await this.getWriteListBySimdIdAndPhone(simId,item.whiteNumber);
      if(write) {
        write.status = item.status;
        await this.update({status: item.status}, write.id);
      } else {
        write = { simId, phone: item.whiteNumber };
        const sim = await service.sim.getSimBySimId(simId);
        // 缺少调用移动端发送短信的接口，在此位置调用
        write.uname = sim.uname;
        write.uid = sim.uid;
        write.status = item.status;
        await this.create(write);
      }
    }
    return res;
  }
  async getWriteListBySimId(query) {
    const attributes = [ 'id', 'phone','status', 'createdAt' ];
    const { simId } = query;
    const Op = this.getOp();
    const where = {status: {[Op.in]: [1,2]}};
    await this.getWriteListBySimIdInCHM(simId);
    if (simId) {
      where.simId = { [Op.substring]: simId };
    }

    const result = await this.app.model.WriteList.findAll({ attributes,
      where,
    });
    return result;
  }
  
  async getWriteListBySimdIdAndPhone(simId, phone) {
    const where = {};
    if (simId) {
      where.simId = simId ;
    }
    if (phone) {
      where.phone = phone;
    }
    const result = await this.app.model.WriteList.findAll({
      where,
    });
    return result[0];
  }

  async create(writeList) {
    try {
      await this.app.model.WriteList.create(writeList);
    } catch (e) {
      return false;
    }
    return true;
  }
  async update(writeList,id) {
    try {
      await this.app.model.WriteList.update(writeList,{where:{id}});
    } catch (e) {
      return false;
    }
    return true;
  }

}
module.exports = WriteListService;
