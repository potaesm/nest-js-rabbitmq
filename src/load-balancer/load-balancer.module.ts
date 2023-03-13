import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AMQPClientModule } from 'src/amqp-client/amqp-client.module';
import { LoadBalancerController } from './load-balancer.controller';
import { LoadBalancerService } from './load-balancer.service';

@Module({
  imports: [AMQPClientModule],
  controllers: [LoadBalancerController],
  providers: [LoadBalancerService, ConfigService],
})
export class LoadBalancerModule {}
