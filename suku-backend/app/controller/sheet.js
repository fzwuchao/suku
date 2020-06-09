'use strict';

const BaseController = require('../core/baseController');

class SheetController extends BaseController {
  async importFile() {
    await this.ctx.service.sheet.importFile();
    this.success(null, '');
  }

  async uploadFile() {
    const result = await this.ctx.service.sheet.uploadFile();
    if (result.uploadSuccess) {
      this.success(result, '');
    } else {
      this.fail('', '', result.msg);
    }
  }
}

module.exports = SheetController;
