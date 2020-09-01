'use strict';
const SERV_STATUS = {
  ON: 1,
  OFF: 0,
};
const SERV_OP_SINGLE = {
  ON: 0,
  OFF: 1,
};
const SERV_OP_BATCH = {
  ON: 1,
  OFF: 0,
};
const OPER_TYPE_SINGLE = {
  RECOVER: 1,
  STOP: 0,
  WAIT_ACTIVE: 6,
};
const OPER_TYPE_BATCH = {
  ACTIVE_STOP: 9,
  STOP_ACTIVE: 11,
};
const ONELINK_STATUS = {
  ON: 1,
  OFF: 0,
};
const PERM_MENU_TYPE = {
  MENU: 1,
  BTN: 2,
  FUN: 3,
};
const SIM_TYPE = {
  CALL: 'B',
  CALLED: 'A',
};
const SIM_ISACTIVE = {
  ON: 1,
  OFF: 0,
};
const SIM_VOICE_SERV_STATUS = {
  ON: 1,
  OFF: 0,
};
const SIM_FLOW_SERV_STATUS = {
  ON: 1,
  OFF: 0,
};
const SIM_MSG_SERV_STATUS = {
  ON: 1,
  OFF: 0,
};
const SIM_CARD_STATUS = {
  WAIT: '1',
  ACTIVE: '2',
  STOP: '4',
  CANCEL: '21',
  TEST: '6',
  ARREARAGE: '22',
};
const SIM_OPEN_STATUS = {
  ON: 1,
  OFF: 0,
};
const COMBO_TYPE = {
  ACTIVE: 1,
  INCREASE: 2,
  DISCOUNTS: 3,
};
const ORDER_STATUS = {
  NON_PAYMENT: 1,
  SUCCESS: 2,
  FAIL: 0,
};
const ORDER_TYPE = {
  PRE: 1,
  INCRE: 2,
  DISCO: 3,
  RENEW: 4,
};

const SERVICE_TYPE = {
  VOICE: '01',
  FLOW: '11',
  MSG: '08',
};

const LIMT_OPTY = {
  ADD: 1,
  DEL: 2,
  UPDATE: 3,
};

// 角色类型:1-系统管理员, 2-仓库管理员, 3-业务员, 4-运营客服, 5-经销商, 6-分销商
const ROLE_TYPE = [
  { NAME: 'sysManager', DISPLAYNAME: '系统管理员', CODE: 1, LEVEL: 0 },
  { NAME: 'warehouseManager', DISPLAYNAME: '仓库管理员', CODE: 2, LEVEL: 1 },
  { NAME: 'clerk', DISPLAYNAME: '业务员', CODE: 3, LEVEL: 2 },
  { NAME: 'operationService', DISPLAYNAME: '运营客服', CODE: 4, LEVEL: 1 },
  { NAME: 'dealer', DISPLAYNAME: '经销商', CODE: 5, LEVEL: 3 },
  { NAME: 'reseller', DISPLAYNAME: '分销商', CODE: 6, LEVEL: 4 },
];

const VOICE_GROUPID = {
  "shenzhenlikang1": '8811000009550018',
  "shenzhensukudianzikeji": '311000011072103'
}
const FLOW_GROUP_TYPE = {
  SMALL: 2,
  BIG: 1
}

const FLOW_GROUP = {
  "shenzhenlikang1": {
    '1':{
      'groupId': '8811000012875167',
      'offerId': '100004863'
    },
    '2': {
      'groupId': '8811000009546026',
      'offerId': '100004842'
    }
  },
  "shenzhensukudianzikeji": {
    '2': {
      'groupId': '311000011032095',
      'offerId': '100004842'
    }
  }
}

const WRITELIST_STATUS = {
  SUCCESS: '1',
  FAILED: '0',
  DEALING: '2'
}

const WITHDRAWAL_RECORD_STATUS = {
  UNTREATED: 1,
  PROCESSED: 2
}

module.exports = () => {
  return {
    SERV_STATUS,
    SERV_OP_SINGLE,
    SERV_OP_BATCH,
    OPER_TYPE_SINGLE,
    OPER_TYPE_BATCH,
    ONELINK_STATUS,
    PERM_MENU_TYPE,
    SIM_TYPE,
    SIM_ISACTIVE,
    SIM_VOICE_SERV_STATUS,
    SIM_FLOW_SERV_STATUS,
    SIM_MSG_SERV_STATUS,
    SIM_CARD_STATUS,
    SIM_OPEN_STATUS,
    COMBO_TYPE,
    ORDER_STATUS,
    ORDER_TYPE,
    SERVICE_TYPE,
    ROLE_TYPE,
    LIMT_OPTY,
    VOICE_GROUPID,
    WRITELIST_STATUS,
    FLOW_GROUP,
    FLOW_GROUP_TYPE,
    WITHDRAWAL_RECORD_STATUS
  };
};
