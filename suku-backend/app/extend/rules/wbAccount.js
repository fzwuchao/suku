'use strict';
const UserRules = {
  id: {
    type: 'int?',
  },
  uid: {
    type: 'int?',
  },
  account: {
    type: 'string?',
  },
  acName: { type: 'string?' }, // '手机号码'
  aliasName: {
    type: 'string?',
  },
  acAddr: {
    type: 'string?',
  },
  createdAt: {
    type: 'dateTime?',
  },
  updatedAt: {
    type: 'dateTime?',
  },
};

module.exports = UserRules;

