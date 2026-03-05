import { NestFactory } from '@nestjs/core';
import { ProtectionOrdersModule } from './protection-orders.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProtectionOrdersModule);
  const configService = app.get(ConfigService);

  // Eng muhim debug ma'lumotlari:
  console.log('Current working directory (process.cwd()):', process.cwd());
  console.log('__dirname (main.ts joylashuvi):', __dirname);
  console.log('Possible .env paths:');
  console.log('  - Rootdan:', join(process.cwd(), '.env'));
  console.log(
    '  - App ichidan (agar assets ko‘chirilgan bo‘lsa):',
    join(__dirname, '.env'),
  );
  console.log(
    '  - Subfolder misol:',
    join(process.cwd(), 'apps/protection-orders/.env'),
  );

  // Env o'qish natijalari:
  console.log('Raw process.env.PORT:', process.env.PORT);
  console.log('ConfigService PORT:', configService.get<number>('PORT'));
  console.log('ConfigService DB_HOST:', configService.get<string>('DB_HOST'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Protection Orders running on port ${port}`);
}
bootstrap();
