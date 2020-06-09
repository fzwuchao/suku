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

  async parseSimIdFile(filepath) {
    const { logger } = this.ctx;
    const sheetData = [];
    let parseSuccess = false;
    let msg = '';
    const result = { parseSuccess: false, msg: '', sheetData: [] };

    logger.info('【文件路径】:', filepath);
    logger.info('【解析-Start】');
    const startTime = moment().milliseconds();
    const workbook = XLSX.readFile(filepath);
    const { Sheets } = workbook;
    for (const key in Sheets) {
      if (Sheets.hasOwnProperty(key)) {
        // { '!ref': 'A1:A2' }，冒号前面代表第一个单元格，后面为最后一个单元格
        const ref = Sheets[key]['!ref'];
        if (ref) {
          const range = ref.split(':');
          const colName = 'A';
          // 保证excel表的数据是放在第一列
          if (range[0].startsWith(colName) && range[1].startsWith(colName)) {
            // 假如有12条数据，分别对应的cell为A1、A2、A3、...、A12
            const start = Number(range[0].substring(1));
            const end = Number(range[1].substring(1));
            for (let i = start; i < end + 1; i++) {
              const cell = `A${i}`;
              sheetData.push(Sheets[key][cell].v);
            }
            parseSuccess = true;
            result.parseSuccess = true;
          } else {
            msg = '数据必须在sheet中的第一列';
            logger.error(`【${msg}】`);
            result.msg = msg;
          }
        } else {
          msg = '无效的内容';
          logger.error(`【${msg}】`);
          result.msg = msg;
        }
        break;
      }
    }

    if (!parseSuccess) {
      return result;
    }

    const endTime = moment().milliseconds();
    result.sheetData = sheetData;
    logger.info(sheetData);
    logger.info(`【解析-End】总条数: ${sheetData.length}, 总耗时: ${endTime - startTime} ms`);
    return result;
  }

  async uploadFile() {
    const { request, logger } = this.ctx;
    if (request.files.length > 1) {
      logger.error(`【只能上传一个文件】上传文件数：${request.files.length}`);
      return { uploadSuccess: false, msg: '只能上传一个文件' };
    }

    const { filename, filepath } = request.files[0];
    logger.info('【上传的文件名】:', filename, ' 【文件路径】:', filepath);
    return { uploadSuccess: true, filepath };
  }
}

module.exports = SheetService;
