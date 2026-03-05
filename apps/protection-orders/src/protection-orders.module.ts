import { Module } from '@nestjs/common';
import { ProtectionOrdersController } from './protection-orders.controller';
import { ProtectionOrdersService } from './protection-orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProtectionOrder } from './entities/protection-orders.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'protection-orders', '.env'),
    }),

    // PostgreSQL ulanish
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const password = config.get<string>('DB_PASSWORD');

        console.log('DB_PASSWORD from ConfigService:', password); // <-- bu chiqishi kerak: 2004
        console.log('Type of password:', typeof password); // <-- string bo'lishi kerak
        console.log(
          'All env vars loaded:',
          config.get('DB_HOST'),
          config.get('DB_NAME'),
        ); // tekshirish uchun

        if (typeof password !== 'string') {
          throw new Error(
            'DB_PASSWORD is not a string! Check .env file or ConfigModule',
          );
        }

        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: password,
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // productionda false!

          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
    }),
    TypeOrmModule.forFeature([ProtectionOrder]),
  ],
  controllers: [ProtectionOrdersController],
  providers: [ProtectionOrdersService],
})
export class ProtectionOrdersModule {}
