'use strict';
const user = require('./user');
const sim = require('./sim');
const onelink = require('./onelink');
const simLogistics = require('./simLogistics');

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
    simLogistics: createRule(simLogistics),
  };
};
