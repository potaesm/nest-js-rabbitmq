import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AMQPClient } from 'src/amqp-client/amqp-client.interface';
import { v4 as uuid } from 'uuid';
import constants from 'src/constants';
import { Channel, ConsumeMessage } from 'amqplib';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class LoadBalancerService {
  private logger = new Logger('LoadBalancerService');
  private appConfig: AppConfig;
  constructor(
    @Inject(constants.amqp.AMQP_CLIENT)
    private amqpClient: AMQPClient,
    private configService: ConfigService,
  ) {
    this.appConfig = this.configService.get('APP_CONFIG');
    this.amqpClient.subscribe(
      this.appConfig.QUEUE_NAME,
      this.processTask,
      this.logger,
    );
  }
  private processTask = async (
    msg: ConsumeMessage,
    channel: Channel,
  ): Promise<void> => {
    this.logger.log(
      `Worker pool received\n${JSON.stringify(
        JSON.parse(msg.content.toString()),
        null,
        2,
      )}\nfrom ${this.appConfig.QUEUE_NAME}`,
    );
    const numAvailableWorker = Number(this.appConfig.NUM_AVAILABLE_WORKER);
    this.logger.log(`Worker pool size: ${numAvailableWorker}`);
    let workerIndex = 0;
    let isWorkerAvailable = await this.getWorkerStatus(workerIndex);
    while (!isWorkerAvailable) {
      this.logger.log(`Worker[${workerIndex}] is busy`);
      workerIndex = (workerIndex + 1) % numAvailableWorker;
      isWorkerAvailable = await this.getWorkerStatus(workerIndex);
    }
    /** Worker processes task */
    this.logger.log(`Task was done by Worker[${workerIndex}]`);
    channel.ack(msg);
  };
  private async getWorkerStatus(_workerIndex: number): Promise<boolean> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(Math.random() < 0.5), 500),
    );
  }
  async addRequestQueue(id: string = uuid(), body: any = {}): Promise<any> {
    if (!id) id = uuid();
    const result = await this.amqpClient.publish(
      this.appConfig.QUEUE_NAME,
      { id, body },
      this.logger,
    );
    return { result };
  }
}
