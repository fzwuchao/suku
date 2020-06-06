'use strict';
const messageSendRules = {
  id: {
    type: 'int?',
  },
  simId: {
    type: 'string?',
  },
  senderId: {
    type: 'int?',
  },
  sender: {
    type: 'string?',
  },
  orderNo: {
    type: 'string?',
  },
  retmesg: {
    type: 'string?',
  },
  content: {
    type: 'string?',
  },
  gwid: {
    type: 'string?',
  },
  retcode: {
    type: 'string?',
  },

  createdAt: {
    type: 'dateTime?',
  },
  updatedAt: {
    type: 'dateTime?',
  },
};

module.exports = messageSendRules;

