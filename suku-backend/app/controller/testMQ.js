'use strict';

const BaseController = require('../core/baseController');

class TestMQController extends BaseController {
  async sendMQMsg() {
    this.ctx.service.rabbitmq.send();
    console.log('999999');
    this.success('', '发送成功');
  }

  receiveMQMsg() {
    this.ctx.service.rabbitmq.receive();
    console.log('919191');
    this.success('', '接收成功');
  }

  close() {
    this.ctx.service.rabbitmq.closeMQConnection();
    this.success('', '信道关闭');
  }

}
module.exports = TestMQController;
