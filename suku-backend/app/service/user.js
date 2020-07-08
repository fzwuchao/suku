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

  async getAllUserIds(pids, ids) {
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
      await this.getAllUserIds(newPids, ids);
    }
    return ids;
  }

  async getAllUsers(pids, users) {
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
      await this.getAllUsers(newPids, users);
    }
    return users;
  }
  async getUsersPage(pid, pageSize, pageNum) {
    const Op = this.getOp();
    const user = this.getCurUser();
    const attributes = [ 'id', 'pid', 'pname', 'name', 'phone', 'openMsg', 'autoTransfer', 'username', 'email', 'mchId', 'createdAt', 'updatedAt' ];
    const where = {};
    if (user.level === 0) {
      attributes.push('rate');
    }
    const role = await this.ctx.service.role.getRoleInfo(user.roleId);
    if (role.level !== 1 && role.level !== 0) {
      const ids = await this.getAllUserIds([ pid ]);
      where.id = { [Op.in]: ids };
    }
    const result = await this.findAndCountAll('User', pageSize, pageNum, {
      attributes,
      where,
      include: {
        model: this.app.model.Role,
        attributes: [ 'displayName' ],
      },
    });
    return result;
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
