import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { User } from './entities/users.entity';
import { RolePermission } from './entities/role_permissions.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user-service/user.service';
import { SearchService } from '../search/search.service';
import { HttpProxyService } from './common/http-proxy.service';
import servicesConfig from './config/services.config';
import { AdminSeederService } from '../seeder/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'auth', '.env'),
      load: [servicesConfig], // ← mana shu
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
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    HttpModule,
    TypeOrmModule.forFeature([User, RolePermission]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    SearchService,
    HttpProxyService,
    AdminSeederService,
  ],
})
export class AuthModule {}
