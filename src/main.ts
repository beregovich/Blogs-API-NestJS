import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
import * as cookieParser from 'cookie-parser';

interface ISetModalState {
  (value: boolean): string;
}

const setModaState = (a: boolean): string => {
  return 'ok';
};
function ModalWindow(setModaState: ISetModalState): string {
  return 'ok';
}
ModalWindow(setModaState);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
