'use strict';
const messageSendRules = {
  id: {
    type: 'int?',
  },
  simId: {
    type: 'string?',
  },
  uid: {
    type: 'int?',
  },
  uname: {
    type: 'string?',
  },
  content: {
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

