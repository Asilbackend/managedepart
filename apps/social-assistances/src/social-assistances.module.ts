import { Module } from '@nestjs/common';
import { SocialAssistanceController } from './social-assistances.controller';
import { SocialAssistanceService } from './social-assistances.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SocialAssistance } from './entities/social-assistances.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'social-assistances', '.env'),
    }),

    // PostgreSQL ulanish
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ❗ Productionda false

        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    // Muhim qism → entityni shu modulda ro‘yxatdan o‘tkazing
    TypeOrmModule.forFeature([SocialAssistance]),
  ],
  controllers: [SocialAssistanceController],
  providers: [SocialAssistanceService],
})
export class SocialAssistancesModule {}
