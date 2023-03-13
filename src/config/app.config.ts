import { registerAs } from '@nestjs/config';

export interface AppConfig {
  PORT: number;
  AMQP_URI: string;
  QUEUE_NAME: string;
  NUM_AVAILABLE_WORKER: number;
}

export default registerAs(
  'APP_CONFIG',
  () =>
    ({
      PORT: Number(process.env.PORT),
      AMQP_URI: process.env.AMQP_URI,
      QUEUE_NAME: process.env.QUEUE_NAME,
      NUM_AVAILABLE_WORKER: Number(process.env.NUM_AVAILABLE_WORKER),
    } as AppConfig),
);
