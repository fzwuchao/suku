'use strict';
const SimRules = {
  id: {
    type: 'int?',
  },
  simId: {
    type: 'int?', // 加问号表示这个参数非必要
  },
  simIdRange: {
    type: 'array?',
    itemType: 'int',
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
  onelinkId: {
    type: 'int?',
  },
  onelinkName: {
    type: 'string?',
  },
  activeMenuId: {
    type: 'int?',
  },
  userId: {
    type: 'int?',
  },
  otherMenuIds: {
    type: 'string?',
  },
  filepath: {
    type: 'string?',
  }
};

module.exports = SimRules;
