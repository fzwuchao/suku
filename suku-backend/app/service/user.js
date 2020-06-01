'use strict';

// const uuid = require('uuid');
// const path = require('path');

const Service = require('egg').Service;

// 导出文件所在路径
// const FILE_PATH_PREFIX = '/var/tmp/';

// user表名
// const TABLE_USER = 'user';

class UserService extends Service {
  async getLoginUser(username, password) {
    const [ user ] = await this.app.model.User.findAll({
      where: {
        username,
        password,
      },
    });

    return user;
  }

  async getUsersByPid(pid) {
    const result = await this.app.model.User.findAll({ where: {
      pid,
    } });
    return result;
  }

  /*  // 导入数据
  async loadData(filepath) {
    await this.app.mysql.query(`load data local infile ? into table ${TABLE_USER} FIELDS TERMINATED BY \',\' IGNORE 1 LINES`, [ filepath ], (error, results, fields) => {
      if (error) throw error;
    });
  }

  async exportData() {
    const filepath = `${FILE_PATH_PREFIX}${uuid()}.csv`;
    await this.app.mysql.query('select * from user into outfile ?', [ filepath ]);
    this.ctx.logger.info('【临时文件路径】:', filepath);
    return filepath;
  } */

  /**
   * 批量插入
   * @param {array} dataList - 数组元素为user
   * @return {number} - 插入的条数
   */
  /*  async batchInsert(dataList) {
    if (dataList.length === 0) return 0;
    const sqlPrefix = `insert into ${TABLE_USER} (username, password, name, created_at) values `;
    const sqlSuffix = dataList.reduce((acc, cur) => {
      const { username, password, name } = cur;
      const val = [ `'${username}'`, password, `'${name}'`, 'now()' ].join(',');
      acc.push(`(${val})`);
      return acc;
    }, []);

    const sqlStr = `${sqlPrefix}${sqlSuffix.join(',')}`;
    await this.app.mysql.query(sqlStr);
    return dataList.length;
  } */

}

module.exports = UserService;
