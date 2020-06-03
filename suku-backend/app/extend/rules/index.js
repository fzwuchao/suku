'use strict';
const user = require('./user');
const pageRules = {
  pageNum: {
    type: 'int',
  },
  pageSize: {
    type: 'int',
  },
};
module.exports = () => {
  return { pageRules, user };
};
