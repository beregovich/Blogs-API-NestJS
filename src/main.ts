import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDb } from './infrastructure/database/db';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

interface IPostgresConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: boolean;
  synchronize: boolean;
  ssl: { rejectUnauthorized: boolean };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const configHeroku = configService.get<IPostgresConfig>(
    'PostgresHerokuConfig',
  );
  console.dir(configHeroku);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const customErrors = errors.map((e) => {
          const firstError = JSON.stringify(e.constraints);
          return { field: e.property, message: firstError };
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  await app.listen(process.env.PORT || 5000);
}
try {
  bootstrap();
} catch (e) {
  console.log('BOOTSTRAP CALL FAILED');
  console.log('ERROR: ');
  console.log(e);
}
