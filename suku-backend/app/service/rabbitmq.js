'use strict';
const amqp = require('amqplib/callback_api');
const BaseService = require('../core/baseService');
const url = 'amqp://localhost';
const queue = 'task_queue';

class RabbitmqService extends BaseService {
  send() {
    amqp.connect(url, (error0, connection) => {
      console.log('00000')
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }
        const msg = 'Hello World!';

        channel.assertQueue(queue, {
          // durable: false,
          durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(msg), {
          persistent: true,
        });
        console.log(' [x] Sent %s', msg);
      });
    });
  }
  receive() {
    amqp.connect(url, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        channel.assertQueue(queue, {
          // durable: false,
          durable: true,
        });

        channel.consume(queue, msg => {
          console.log(' [x] Received %s', msg.content.toString());
        }, {
          noAck: true,
        });
      });
    });
  }
  closeMQConnection() {
    amqp.connect(url, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.close();
      // process.exit(0);
    });
  }
}

module.exports = RabbitmqService;
