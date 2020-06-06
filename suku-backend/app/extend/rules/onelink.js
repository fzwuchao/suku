'use strict';
const onelinkRule = {
  id: {
    type: 'int?',
  },
  name: {
    type: 'string?',
  },
  appId: {
    type: 'string?',
  },
  secretKey: {
    type: 'string?',
  },
  apiHost: {
    type: 'string?',
  },
  apiVersion: {
    type: 'string?',
  },
  nameKey: {
    type: 'string?',
  },
  status: {
    type: 'int?',
  },
  createdAt: {
    type: 'dateTime?', // '创建时间',
  },
  updatedAt: {
    type: 'dateTime?', // '更新时间',
  },

};

module.exports = onelinkRule;
