'use strict';

const BaseController = require('../core/baseController');

class TestMsgSendController extends BaseController {

  async testMsgSendUpgoing() {
    const resXml = `<?xml version="1.0" encoding="UTF-8"?>
    <svc_result ver="2.0.0">
    <retcode>00</retcode>
    <retmesg></retmesg>
    <itemlist>
    <item>
    <phone>13911111111</phone>
    <content>xxxx</content>
    <time>20200701</time>
    </item>
    <item>
    <phone>13911111444</phone>
    <content>yyyy</content>
    <time>20200701</time>
    </item>
    </itemlist>
    </svc_result>`;
    this.ctx.body = resXml;
  }

  async testMsgSend() {
    const resXml = `<?xml version="1.0" encoding="UTF-8"?>
    <svc_result ver="2.0.0">
    <response_info>
    <gwid>1233333</gwid>
    <retcode>00</retcode>
    <retmesg></retmesg>
    </response_info>
    </svc_result>`;
    this.ctx.body = resXml;
  }
  async tMsgSendUpgoing() {
    const { service } = this.ctx;
    await service.chinaMobile.sendUpgoingMessage('1', '2');
  }

  async tMsgSend() {
    const { service } = this.ctx;
    await service.chinaMobile.sendMessage('1', '2', '13911199999', 'hello');
  }

}
module.exports = TestMsgSendController;
