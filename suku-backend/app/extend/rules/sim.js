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
  uname: {
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
  activeComboName: {
    type: 'string?',
  },
  onelinkId: {
    type: 'int?',
  },
  onelinkName: {
    type: 'string?',
  },
  activeComboId: {
    type: 'int?',
  },
  uid: {
    type: 'int?',
  },
  otherComboIds: {
    type: 'string?',
  },
  filepath: {
    type: 'string?',
  },
  overdueTime: {
    type: 'dateTime?',
  },
  privateMoney: {
    type: 'number?',
  }
};

module.exports = SimRules;
