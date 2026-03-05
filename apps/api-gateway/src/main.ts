import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { JwtAuthGuard } from './security/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthorizationGuard } from './security/authorization.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(AuthorizationGuard));

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    ) // ikkinchi parametr — security name

    .addSecurityRequirements('bearer')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // token refresh qilganda saqlanib turadi (qulay)
    },
  });

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 0);

  await app.listen(port);
  console.log('listen:' + port);
}
bootstrap();
