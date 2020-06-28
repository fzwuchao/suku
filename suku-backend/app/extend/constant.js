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
  };
};
