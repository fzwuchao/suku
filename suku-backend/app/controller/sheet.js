'use strict';

const fs = require('fs');

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

  // 用于删除文件
  async removeFile(filepath) {
    const { logger } = this.ctx;
    let isOk = false;
    // 文件是否存在
    if (fs.existsSync(filepath)) {
      // 判断是文件，而不是文件夹
      const isFile = fs.statSync(filepath).isFile();
      if (isFile) {
        fs.unlinkSync(filepath);
        isOk = true;
      } else {
        logger.info(`【不是文件】: ${filepath}`);
      }
    } else {
      logger.info(`【文件不存在】: ${filepath}`);
    }

    return isOk;
  }
}

module.exports = SheetController;
