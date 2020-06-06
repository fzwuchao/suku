'use strict';
const SimRules = {
  simId: {
    type: 'string?', // 加问号表示这个参数非必要
  },
  simIdRange: {
    type: 'array?',
    itemType: 'string',
  },
  username: {
    type: 'string?',
  },
  netStatus: {
    type: 'int?',
  },
  isActive: {
    type: 'int?',
  },
  simType: {
    type: 'string?',
  },
  activeMenuName: {
    type: 'string?',
  },
};

module.exports = SimRules;
