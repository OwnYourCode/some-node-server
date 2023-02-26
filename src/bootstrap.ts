import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('DIMS back-end API')
    .setDescription('Dev incubator management system REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  const logger = new Logger('bootstrap');

  const port = config.get('app.port');
  console.log('------------------------------');
  console.log('------------ app.port - ', port);
  console.log('------------------------------');
  await app.listen(port, () => {
    logger.log(`Server is listen on http://localhost:${port}`);
  });
}
