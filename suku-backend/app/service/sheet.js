'use strict';

/**
 * 文件服务
 */
const Service = require('egg').Service;
// 用于解析xlsx文件
const XLSX = require('xlsx');
const fs = require('fs');
const moment = require('moment');

class SheetService extends Service {
  async importFile() {
    const { model } = this.app;
    const { User } = model;
    const { request, logger, service } = this.ctx;
    const status = '';
    logger.info(`【上传文件总数：${request.files.length} 个】`);
    for (const index in request.files) {
      const { filename, filepath } = request.files[index];

      logger.info('【上传的文件名】:', filename, ' 【文件路径】:', filepath);
      logger.info('【解析-Start】');
      // await service.user.loadData(filepath);
      const startTime = moment().milliseconds();
      const workbook = XLSX.readFile(filepath);
      const { Sheets } = workbook;
      let sheetData = [];

      for (const key in Sheets) {
        if (Sheets.hasOwnProperty(key)) {
          sheetData = XLSX.utils.sheet_to_json(Sheets[key]);
        }
      }

      const endTime = moment().milliseconds();
      logger.debug(sheetData);
      logger.info(`【解析-End】总条数: ${sheetData.length}, 总耗时: ${endTime - startTime} ms`);

      logger.info('【插入-Start】');
      const startInsertTime = moment().milliseconds();
      // await this.ctx.service.user.batchInsert(sheetData);
      await User.bulkCreate(sheetData);
      const endInsertTime = moment().milliseconds();
      logger.info(`【插入-End】总耗时: ${endInsertTime - startInsertTime} ms`);
      await this.ctx.cleanupRequestFiles();
    }
  }

  removeFile(filepath) {
    fs.unlink(filepath, err => {
      if (err) throw err;
      this.ctx.logger.info(filepath, '成功删除！');
    });
  }

  createReadStream(filepath) {
    return fs.createReadStream(filepath);
  }
}

module.exports = SheetService;
