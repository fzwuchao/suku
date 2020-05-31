'use strict';

const BaseController = require('../core/base_controller');

class SheetController extends BaseController {
  async importFile() {
    await this.ctx.service.sheet.importFile();
    this.success(null, '');
  }
}

module.exports = SheetController;
