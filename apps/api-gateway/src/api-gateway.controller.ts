import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { Public } from './decorators/public.decorator';

@Controller('api/gateway')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('hello')
  @Public()
  sayHello() {
    return this.apiGatewayService.getHello();
  }
}
