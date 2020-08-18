'use strict';
const user = require('./user');
const sim = require('./sim');
const onelink = require('./onelink');
const simCombo = require('./simCombo');
const comboPack = require('./comboPack');
const simLogistics = require('./simLogistics');
const messageSend = require('./messageSend');
const simOrder = require('./simOrder');
const writeList = require('./writeList');
const wbAccount = require('./wbAccount');
const permission = require('./permission');
const role = require('./role');

const pageRules = {
  pageNum: {
    type: 'int',
  },
  pageSize: {
    type: 'int',
  },
};

const createRule = ruleObj => {
  return (retuires = []) => {
    const newRules = JSON.parse(JSON.stringify(ruleObj));
    for (let i = 0; i < retuires.length; i++) {
      const attr = retuires[i];
      const type = newRules[attr].type;
      newRules[attr].type = type.substr(0, type.length - 1);
    }
    return newRules;
  };
};

module.exports = () => {
  return {
    pageRules,
    user: createRule(user),
    sim: createRule(sim),
    onelink: createRule(onelink),
    simCombo: createRule(simCombo),
    comboPack: createRule(comboPack),
    simLogistics: createRule(simLogistics),
    messageSend: createRule(messageSend),
    simOrder: createRule(simOrder),
    writeList: createRule(writeList),
    permission: createRule(permission),
    role: createRule(role),
    wbAccount: createRule(wbAccount),
  };
};
