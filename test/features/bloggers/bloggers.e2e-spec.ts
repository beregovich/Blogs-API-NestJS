import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../../../src/app.module';
import * as request from 'supertest';
import { log } from "util";

jest.setTimeout(1000 * 100);
describe('BloggersController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

  });

  describe('DELETE ALL DATA', () => {
    it('should delete all data, status 204', async () => {
      const response = await request(app.getHttpServer())
        .delete('/testing/all-data')
        expect(response.status).toBe(204);
    });
    it('should return pagination and empty items array', async () => {
      const emptyBloggersView = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      };
      await request(app.getHttpServer())
        .get('/bloggers')
        .expect(200, emptyBloggersView);
    });
  })

  describe('CREATING. POST->GET by id', () => {
    it('create and return. Get him by id', async () => {
      const newBlogger = {
        name: "Vasya",
        youtubeUrl: "https://youtube.com",
      };
      const response = await request(app.getHttpServer())
        .post('/bloggers')
        .set({ "Authorization":"Basic YWRtaW46cXdlcnR5" })
        .send(newBlogger);
      expect(response.status).toBe(201);
      expect(response.body.name).toEqual(newBlogger.name);
      expect(response.body.youtubeUrl).toEqual(newBlogger.youtubeUrl);
      const newBloggerId = response.body.id;
      expect(newBloggerId).toBeDefined()
      const getBloggerResponse = await await request(app.getHttpServer())
        .get(`/bloggers/${newBloggerId}`)
      expect(response.body.name).toEqual(getBloggerResponse.body.name);
      expect(response.body.youtubeUrl).toEqual(getBloggerResponse.body.youtubeUrl);
    });
  });

  describe('UPDATING', () => {
    it('create blogger then update name', async () => {
      const newBlogger = {
        name: "Sasha",
        youtubeUrl: "https://youtube.com",
      };
      const bloggersNameToUpdate = 'Aleksandr'
       const response = await request(app.getHttpServer())
        .post('/bloggers')
        .set({ "Authorization":"Basic YWRtaW46cXdlcnR5" })
        .send(newBlogger)
      const bloggerId = response.body.id;
      await request(app.getHttpServer())
        .put(`/bloggers/${bloggerId}`)
        .set({ "Authorization":"Basic YWRtaW46cXdlcnR5" })
        .send(
          {
            name: bloggersNameToUpdate,
            youtubeUrl: "https://youtube.com",
          }
        ).expect(204)


    })
  })

  describe('DELETE BY ID', () => {
    it('should return bloggers in items array and delete each', async () => {
      await request(app.getHttpServer())
        .delete('/testing/all-data')
      for(let i=0; i<10; i++){
        await request(app.getHttpServer())
          .post('/bloggers')
          .set({ "Authorization":"Basic YWRtaW46cXdlcnR5" })
          .send({
            name: `blogger${i}`,
            youtubeUrl: "https://youtube.com",})
      }
      const allBloggersResponse = await request(app.getHttpServer())
        .get('/bloggers/')
        .send()
        .expect(200);
      expect(allBloggersResponse.body).toBeDefined();
      const bloggers = allBloggersResponse.body;
      expect(bloggers.items).toBeInstanceOf(Array);
      expect(bloggers.items.length).toBe(10);
      const bloggersIds = bloggers.items.map( blogger => {
        expect(typeof blogger.name).toBe('string');
        expect(typeof blogger.youtubeUrl).toBe('string');
        expect(blogger.id).toBeDefined();
        return blogger.id;
      })
      for(let id of bloggersIds){
        await request(app.getHttpServer())
          .delete(`/bloggers/${id}`)
          .set({ "Authorization":"Basic YWRtaW46cXdlcnR5" })
          .send()
          .expect(204)
      }
    })
    it('items array should be empty ', async () => {
      const allBloggersAfterDeleteResponse = await request(app.getHttpServer())
        .get('/bloggers/')
        .send()
        .expect(200)
      expect(allBloggersAfterDeleteResponse.body.items.length).toBe(0)
    })
  })

  describe('check pagination', () => {
    it('should correct paginate data', async () => {
      await request(app.getHttpServer())
        .delete('/testing/all-data')
      //create 11 bloggers,
      for(let i=0; i<=10; i++){
        await request(app.getHttpServer())
          .post('/bloggers')
          .set({ "Authorization":"Basic YWRtaW46cXdlcnR5" })
          .send({
            name: `blogger${i}`,
            youtubeUrl: "https://youtube.com",})
      }
      const allBloggersResponse = await request(app.getHttpServer())
        .get('/bloggers/')
        .send()
        .expect(200)
      expect(allBloggersResponse.body).toBeDefined()
      const bloggers = allBloggersResponse.body
      expect(bloggers.totalCount).toBe(11)
      expect(bloggers.pageSize).toBe(10)
      expect(bloggers.pagesCount).toBe(2)
    })
  })
});
