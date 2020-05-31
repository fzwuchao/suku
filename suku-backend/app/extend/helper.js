'use strict';

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
  constructor(id, username, name) {
    this.id = id;
    this.username = username;
    this.name = name;
  }
}

const createLoginUser = (id, username, name) => { return new LoginUser(id, username, name); };
const parseLoginUser = jsonStr => {
  const decodeStr = decodeURIComponent(jsonStr);
  if (!isJSON(decodeStr)) return null;

  const tmp = JSON.parse(decodeStr);
  const keys = Object.keys(tmp);

  if (keys.includes('id') && keys.includes('username') && keys.includes('name')) {
    const { id, username, name } = tmp;
    return new LoginUser(id, username, name);
  }

  return null;
};

const stringfyLoginUser = loginUserInfo => {
  return encodeURIComponent(JSON.stringify(loginUserInfo));
};

module.exports = {
  // 登录用户
  loginUser: {
    create: createLoginUser,
    parse: parseLoginUser,
    stringfy: stringfyLoginUser,
  },
};
