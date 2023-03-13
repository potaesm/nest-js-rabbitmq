import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, connect, ConsumeMessage } from 'amqplib';
import constants from 'src/constants';

export const amqpClientProvider = {
  inject: [ConfigService],
  provide: constants.amqp.AMQP_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const appConfig = configService.get('APP_CONFIG');
    const subscribe = async (
      queue: string = appConfig.QUEUE_NAME,
      onMessage: (msg: ConsumeMessage, channel: Channel) => any,
      logger: Logger,
    ): Promise<void> => {
      try {
        const connection = await connect(appConfig.AMQP_URI);
        logger.log(`Subsciber is connected to ${appConfig.AMQP_URI}`);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, {
          durable: true,
        });
        logger.log(`Subsciber is subscribed to ${queue}`);
        channel.prefetch(1);
        logger.log(`Subsciber is waiting for messages in ${queue}`);
        channel.consume(
          queue,
          (msg: ConsumeMessage) => onMessage(msg, channel),
          {
            noAck: false,
          },
        );
      } catch (error) {
        logger.error(error);
      }
    };
    const publish = async (
      queue: string = appConfig.QUEUE_NAME,
      msg: any,
      logger: Logger,
    ): Promise<boolean> => {
      try {
        const connection = await connect(appConfig.AMQP_URI);
        logger.log(`Publisher is connected to ${appConfig.AMQP_URI}`);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, {
          durable: true,
        });
        const result = channel.sendToQueue(
          queue,
          Buffer.from(JSON.stringify(msg)),
          {
            persistent: true,
          },
        );
        logger.log(
          `Publisher published\n${JSON.stringify(msg, null, 2)}\nto ${queue}`,
        );
        await channel.close();
        await connection.close();
        return result;
      } catch (error) {
        logger.error(error);
      }
    };
    return { subscribe, publish };
  },
};
