'use strict';
const amqp = require('amqplib/callback_api');
const BaseService = require('../core/baseService');
const url = 'amqp://localhost';
// const queue = 'task_queue';

class RabbitmqService extends BaseService {
  send() {
    amqp.connect(url, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        const exchange = 'logs';
        const msg = 'Hello World!';

        channel.assertExchange(exchange, 'fanout', {
          durable: false,
        });
        channel.publish(exchange, '', Buffer.from(msg));
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
        const exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
          durable: false,
        });

        channel.assertQueue('', {
          exclusive: true,
        }, (error2, q) => {
          if (error2) {
            throw error2;
          }
          console.log(' [*] Waiting for messages in %s.', q.queue);
          channel.bindQueue(q.queue, exchange, '');

          channel.consume(q.queue, msg => {
            if (msg.content) {
              console.log(' [x] %s', msg.content.toString());
            }
          }, {
            noAck: true,
          });
        });

        // channel.assertQueue(queue, {
        //   // durable: false,
        //   durable: true,
        // });

        // channel.consume(queue, msg => {
        //   console.log(' [x] Received %s', msg.content.toString());
        // }, {
        //   noAck: true,
        // });
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
