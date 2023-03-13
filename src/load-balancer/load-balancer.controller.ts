import { Body, Controller, Param, Post } from '@nestjs/common';
import { LoadBalancerService } from './load-balancer.service';

@Controller('load-balancer')
export class LoadBalancerController {
  constructor(private loadBalancerService: LoadBalancerService) {}

  @Post('/:id?')
  addRequestQueue(@Param('id') id: string, @Body() body: any): Promise<any> {
    return this.loadBalancerService.addRequestQueue(id, body);
  }
}
