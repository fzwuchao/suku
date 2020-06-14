'use strict';

const SimComboRules = {
  id: {
    type: 'int?',
  },
  belongsToSimType: {
    type: 'string?',
  },
  name: {
    type: 'string?',
  },
  comboType: {
    type: 'int?',
  },
  monthFlow: {
    type: 'number?',
  },
  monthVoice: {
    type: 'number?',
  },
  monthRent: {
    type: 'number?',
  },
  renewPrice: {
    type: 'number?',
  },
  months: {
    type: 'int?',
  },
};

module.exports = SimComboRules;
