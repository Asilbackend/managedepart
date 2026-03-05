import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import servicesConfig from './config/services.config';
import { JwtStrategy } from './security/jwt.strategy';
import { JwtAuthGuard } from './security/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationGuard } from './security/authorization.guard';
import { ProtectionOrdersModule } from '../protection-orders/protection-orders.module';
import { SocialAssistancesModule } from '../social-assistances/social-assistances.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'api-gateway', '.env'),
      load: [servicesConfig], // ← mana shu
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    HttpModule,
    AuthModule,
    ProtectionOrdersModule,
    SocialAssistancesModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, JwtStrategy, JwtAuthGuard, AuthorizationGuard],
})
export class ApiGatewayModule {}
