import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { amqpClientProvider } from './amqp-client.provider';

@Module({
  imports: [ConfigModule],
  providers: [amqpClientProvider],
  exports: [amqpClientProvider],
})
export class AMQPClientModule {}
