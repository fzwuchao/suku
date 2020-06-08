'use strict';
const UserRules = {
  id: {
    type: 'int?',
  },
  uid: {
    type: 'int?',
  },
  uname: {
    type: 'string?',
  },
  phone: { type: 'string?' }, // '手机号码',
  simId: {
    type: 'int?',
  },
  status: {
    type: 'int?',
  },
  createdAt: {
    type: 'dateTime?',
  },
  updatedAt: {
    type: 'dateTime?',
  },
};

module.exports = UserRules;

