'use strict';

const uuid = require('uuid');
const MD5 = require('md5');
// const path = require('path');

const BaseService = require('../core/baseService');

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class UserService extends BaseService {
  async getLoginUser(username, password) {
    const [ user ] = await this.app.model.User.findAll({
      where: {
        username,
        password,
      },
    });

    return user;
  }
  async getUserByUsername(username) {
    const [ user ] = await this.app.model.User.findAll({
      where: {
        username,
      },
    });

    return user;
  }
  async getUserByName(name) {
    const user = await this.app.model.User.findOne({
      where: {
        name,
      },
    });

    return user;
  }
  async getUserById(id) {
    const attributes = [ 'id', 'phone', 'name', 'username', 'email', 'mchId', 'rate', 'roleId' ];
    const [ user ] = await this.app.model.User.findAll({ attributes,
      where: {
        id,
      },
    });

    return user;
  }

  async getUserByPid(pid, attr) {
    let attributes = [ 'id', 'name' ];
    if (attr) {
      attributes = attr;
    }
    const user = await this.app.model.User.findAll({ attributes,
      where: {
        pid,
      },
    });

    return user;
  }

  async getAllUserIdsByPid(pids, ids) {
    const attributes = [ 'id' ];
    const Op = this.getOp();
    if (typeof pids === 'number') {
      pids = [ pids ];
    }
    const users = await this.app.model.User.findAll({ attributes,
      where: {
        pid: { [Op.in]: pids },
      },
    });
    if (!ids) {
      ids = [];
      Array.prototype.push.apply(ids, pids);
    }
    if (users.length !== 0) {
      const newPids = [];
      for (let i = 0; i < users.length; i++) {
        ids.push(users[i].id);
        newPids.push(users[i].id);
      }
      await this.getAllUserIdsByPid(newPids, ids);
    }
    return ids;
  }

  async getAllNextUserByPid(pid) {
    const nextUsers = await this.app.model.User.findAll({
      where: {
        pid,
      },
    });
    return nextUsers;
  }

  async getAllUserIds() {
    const attributes = [ 'id' ];

    let ids = await this.app.model.User.findAll({ attributes,
    });
    ids = ids.map(item => { return item.id; });
    return ids;
  }

  async getAllUsersByPid(pids, users) {
    const attributes = [[ 'id', 'value' ], [ 'name', 'key' ]];
    if (typeof pids === 'number') {
      pids = [ pids ];
    }
    const Op = this.getOp();
    if (!users) {
      users = [];
    }
    const curUsers = await this.app.model.User.findAll({ attributes,
      where: {
        pid: { [Op.in]: pids },
      },
    });
    if (curUsers.length !== 0) {
      const newPids = [];
      for (let i = 0; i < curUsers.length; i++) {
        newPids.push(curUsers[i].dataValues.value);
      }
      Array.prototype.push.apply(users, curUsers);
      await this.getAllUsersByPid(newPids, users);
    }
    return users;
  }

  async getAllUsers() {
    const attributes = [[ 'id', 'value' ], [ 'name', 'key' ]];
    const users = await this.app.model.User.findAll({ attributes });
    return users;
  }

  async getUsersPage(pid, pageSize, pageNum, name) {
    const Op = this.getOp();
    const user = this.getCurUser();
    const attributes = [ 'id', 'pid', 'pname', 'name', 'phone', 'openMsg', 'autoTransfer', 'username', 'email', 'mchId', 'createdAt', 'updatedAt' ];
    const where = {};
    if (user.roleLevel === 0 || user.roleType === 5) {
      attributes.push('rate');
    }
    let ids = [];
    if (user.roleLevel <= 1) {
      ids = await this.ctx.service.user.getAllUserIds();
    } else {
      ids = await this.ctx.service.user.getAllUserIdsByPid([ user.id ]);
    }
    where.id = { [Op.in]: ids };
    if (name) {
      where['name'] = {
        [Op.substring]: name,
      };
    }
    const result = await this.findAndCountAll('User', pageSize, pageNum, {
      attributes,
      where,
      include: {
        model: this.app.model.Role,
        attributes: [ 'displayName' ],
        where: {
          level: { [Op.gte ]: user.roleLevel },
        },
      },
    });
    
    return result;
  }

  async batchUpate() {
    const datas = [{
      autoTransfer: 0,
      email: "1",
      id: 1,
      name: "游lan1",
      username:'youlan',
      password: '1'
    },{ 
      autoTransfer: 0,
      email: '3',
      id: 42,
      name: "顶级管理员",
      username: "suadmin",
      password: '1'
    }];

    await this.app.model.User.bulkCreate(datas , {updateOnDuplicate:['id','autoTransfer', 'email', 'name']})
  }

  async create(user) {
    try {
      user.uuid = uuid();
      user.password = MD5(user.username + user.password + 'sukuwulian');
      await this.app.model.User.create(user);
    } catch (e) {
      return false;
    }
    return true;
  }

  async update(user) {
    try {
      if (user.password && user.username) {
        user.uuid = uuid();
        user.password = MD5(user.username + user.password + 'sukuwulian');
      }
      await this.app.model.User.update(user, { where: { id: user.id } });
    } catch (e) {
      return false;
    }
    return true;
  }

  async bulkUpdate(ids, value, oper) {
    // try {
    const values = {};
    values[oper] = value;
    await this.app.model.User.update(values, { where: { id: { [this.getOp().in]: ids } } });
    // } catch (e) {
    //   return false;
    // }
    return true;
  }

}

module.exports = UserService;
