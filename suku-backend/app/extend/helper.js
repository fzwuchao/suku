'use strict';

const rules = require('./rules')();
const apiConfig = require('./api')();
// 判断是否是json字符串
const isJSON = str => {
  if (typeof str === 'string') {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
};

class LoginUser {
  constructor(id, username, name, roleId, roleType, level) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.roleId = roleId;
    this.roleType = roleType;
    this.roleLevel = level;
  }
}

const createLoginUser = (id, username, name, roleId, roleType, level) => { return new LoginUser(id, username, name, roleId, roleType, level); };
const parseLoginUser = jsonStr => {
  const decodeStr = decodeURIComponent(jsonStr);
  if (!isJSON(decodeStr)) return null;

  const tmp = JSON.parse(decodeStr);
  const keys = Object.keys(tmp);

  if (keys.includes('id') && keys.includes('username') && keys.includes('name') && keys.includes('roleId') && keys.includes('roleType')) {
    const { id, username, name, roleId, roleType } = tmp;
    return new LoginUser(id, username, name, roleId, roleType);
  }

  return null;
};

const stringfyLoginUser = loginUserInfo => {
  return encodeURIComponent(JSON.stringify(loginUserInfo));
};
const pageQueryModel = (pageSize, pageNum) => {
  return {
    offset: (pageNum - 1) * pageSize,
    limit: pageSize,
  };
};
const pageModel = (data, pageSize, pageNum) => {
  const { count, rows } = data;
  return {
    totalRecords: count,
    list: rows,
    pageNum,
    pageSize,
  };
};
const CONST = {
  MD5_PWD: 'sukuwulian',
};
// 获取区域内的随机整数
function rnd(n, m) {
  const random = Math.floor(Math.random() * (m - n + 1) + n);
  return random;
}
module.exports = {
  // 登录用户
  loginUser: {
    create: createLoginUser,
    parse: parseLoginUser,
    stringfy: stringfyLoginUser,
  },
  CONST,
  pageQueryModel,
  pageModel,
  rules,
  rnd,
  apiConfig,
};
