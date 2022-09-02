import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../../src/app.module';

jest.setTimeout(1000 * 100);
describe('AppControllers (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  //describe('/bloggers', () => {
  it('GET', () => {
    return request(app.getHttpServer()).get('/').expect(200);
    //.expect('Hello World!');
  });
  // });
});
