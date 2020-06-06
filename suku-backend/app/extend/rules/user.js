'use strict';
const UserRules = {
  id: {
    type: 'int?',
  },
  pid: {
    type: 'int?',
  },
  pname: {
    type: 'string?',
  },
  username: {
    type: 'string?', // '账户名'
  },

  password: {
    type: 'string?',
  }, // '密码',
  phone: {
    type: 'string?',
  }, // '手机号码',
  name: {
    type: 'string?', // '用户名'
  },
  email: {
    type: 'string?',
  }, // '邮箱',
  mchId: {
    type: 'string?',
  },
  rate: {
    type: 'number?',
  }, // '分成率',
  openMsg: {
    type: 'int?',
  },
  autoTransfer: {
    type: 'int?',
  },
  floatPrice: {
    type: 'number?',

  },
  uuid: {
    type: 'string?',
  },
  roleId: {
    type: 'int?', // '角色id',
  },
  createdAt: {
    type: 'dateTime?',
  },
  updatedAt: {
    type: 'dateTime?',
  },
};

module.exports = UserRules;

