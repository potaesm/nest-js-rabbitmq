import { Logger } from '@nestjs/common';
import { Channel, ConsumeMessage } from 'amqplib';

export interface AMQPClient {
  subscribe: (
    queue: string,
    onMessage: (msg: ConsumeMessage, channel: Channel) => any,
    logger: Logger,
  ) => Promise<void>;
  publish: (queue: string, msg: any, logger: Logger) => Promise<boolean>;
}
