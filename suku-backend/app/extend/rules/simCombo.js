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
  monthSumFlowThreshold: {
    type: 'number?',
  },
  monthVoiceDurationThreshold: {
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
