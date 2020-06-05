'use strict';
const UserRules = {
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
module.exports = retuires => {
  const newRules = JSON.parse(JSON.stringify(UserRules));
  for (let i = 0; i < retuires.length; i++) {
    const attr = retuires[i];
    const type = newRules[attr].type;
    newRules[attr].type = type.substr(0, type.length - 1);
  }
  return newRules;
};
