import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoadBalancerModule } from './load-balancer/load-balancer.module';
import { configValidationSchema, appConfig } from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: configValidationSchema,
    }),
    LoadBalancerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
