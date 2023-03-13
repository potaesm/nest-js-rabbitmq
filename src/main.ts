import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const mainLogger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT;
  app
    .listen(port)
    .then(() => {
      mainLogger.log(`Application is listening on port ${port}`);
    })
    .catch((error) => mainLogger.error(error));
}
bootstrap();
