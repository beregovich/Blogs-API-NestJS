import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './database/db';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        throw new BadRequestException(
          errors.map((e) => {
            const firstError = Object.keys(e.constraints)[0];
            return { field: e.property, message: firstError };
          }),
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  //runDb();
  await app.listen(5000);
}
bootstrap();
