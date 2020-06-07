'use strict';
const SimOrderRules = {
  id: {
    type: 'int?',
  },
  orderId: {
    type: 'string?',
  },
  simId: {
    type: 'int?',
  },
  uname: {
    type: 'string?',
  },
  uid: {
    type: 'int?',
  },
  cpname: {
    type: 'string?',
  },
  cpid: {
    type: 'int?',
  },
  cname: {
    type: 'string?',
  },
  cid: {
    type: 'int?',
  },
  dealAmount: {
    type: 'number?',
  },
  renewIncrAmount: {
    type: 'number?',
  },
  orderStatus: {
    type: 'int?',
  },
  orderType: {
    type: 'int?',
  },
  wxSerialNum: {
    type: 'string?',
  },
  createdAt: {
    type: 'dateTime?',
  },
  updatedAt: {
    type: 'dateTime?',
  },
};

module.exports = SimOrderRules;

