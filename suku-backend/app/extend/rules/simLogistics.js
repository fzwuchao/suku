'use strict';
const SimLogisticsRules = {
  id: {
    type: 'int?',
  },
  sender: {
    type: 'string?', // 发卡人
  },
  senderId: {
    type: 'int?',
  },
  receiver: {
    type: 'string?', // 收卡人
  },
  receiverId: {
    type: 'int?', // 收卡人id
  },
  total: {
    type: 'int?', // 发卡数量
  },
  logisticsNo: { // 物流单号
    type: 'string?',
  },
  phone: {
    type: 'string?', // 联系电话
  },
  address: {
    type: 'string?', // 收卡地址
  },
  createdAt: {
    type: 'dateTime?',
  },
  updatedAt: {
    type: 'dateTime?',
  },
};
module.exports = retuires => {
  const newRules = JSON.parse(JSON.stringify(SimLogisticsRules));
  for (let i = 0; i < retuires.length; i++) {
    const attr = retuires[i];
    const type = newRules[attr].type;
    newRules[attr].type = type.substr(0, type.length - 1);
  }
  return newRules;
};
