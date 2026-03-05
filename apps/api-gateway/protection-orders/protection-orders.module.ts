import { Module } from '@nestjs/common';
import { ProtectionOrdersService } from './protection-orders.service';
import { ProtectionOrdersController } from './protection-orders.controller';
import { HttpProxyService } from '../src/common/http-proxy.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ProtectionOrdersController],
  providers: [ProtectionOrdersService, HttpProxyService],
})
export class ProtectionOrdersModule {}
