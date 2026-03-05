import { Module } from '@nestjs/common';
import { SocialAssistancesService } from './social-assistances.service';
import { SocialAssistancesController } from './social-assistances.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HttpProxyService } from '../src/common/http-proxy.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SocialAssistancesController],
  providers: [SocialAssistancesService, HttpProxyService],
})
export class SocialAssistancesModule {}
