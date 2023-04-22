import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';

jest.setTimeout(1000 * 100);
describe('BlogsController (e2e)', () => {
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
      const response = await request(app.getHttpServer()).delete(
        '/testing/all-data',
      );
      expect(response.status).toBe(204);
    });
    it('should return pagination and empty items array', async () => {
      const emptyblogsView = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      };
      await request(app.getHttpServer())
        .get('/blogs')
        .expect(200, emptyblogsView);
    });
  });

  describe('CREATING. POST->GET by id', () => {
    it('create and return. Get him by id', async () => {
      const newblog = {
        name: 'Vasya',
        youtubeUrl: 'https://youtube.com',
      };
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send(newblog);
      expect(response.status).toBe(201);
      expect(response.body.name).toEqual(newblog.name);
      expect(response.body.youtubeUrl).toEqual(newblog.youtubeUrl);
      const newBlogId = response.body.id;
      expect(newBlogId).toBeDefined();
      const getBlogResponse = await request(app.getHttpServer()).get(
        `/blogs/${newBlogId}`,
      );
      expect(response.body.name).toEqual(getBlogResponse.body.name);
      expect(response.body.youtubeUrl).toEqual(getBlogResponse.body.youtubeUrl);
    });
  });

  describe('UPDATING', () => {
    it('create blog then update name', async () => {
      const newblog = {
        name: 'Sasha',
        youtubeUrl: 'https://youtube.com',
      };
      const blogNameToUpdate = 'Aleksandr';
      const response = await request(app.getHttpServer())
        .post('/blogs')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send(newblog);
      const blogId = response.body.id;
      await request(app.getHttpServer())
        .put(`/blogs/${blogId}`)
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          name: blogNameToUpdate,
          youtubeUrl: 'https://youtube.com',
        })
        .expect(204);
    });
  });

  describe('DELETE BY ID', () => {
    it('should return blogs in items array and delete each', async () => {
      await request(app.getHttpServer()).delete('/testing/all-data');
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post('/blogs')
          .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
          .send({
            name: `blog${i}`,
            youtubeUrl: 'https://youtube.com',
          });
      }
      const allblogsResponse = await request(app.getHttpServer())
        .get('/blogs/')
        .send()
        .expect(200);
      expect(allblogsResponse.body).toBeDefined();
      const blogs = allblogsResponse.body;
      expect(blogs.items).toBeInstanceOf(Array);
      expect(blogs.items.length).toBe(10);
      const blogsIds = blogs.items.map((blog) => {
        expect(typeof blog.name).toBe('string');
        expect(typeof blog.youtubeUrl).toBe('string');
        expect(blog.id).toBeDefined();
        return blog.id;
      });
      for (const id of blogsIds) {
        await request(app.getHttpServer())
          .delete(`/blogs/${id}`)
          .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
          .send()
          .expect(204);
      }
    });
    it('items array should be empty ', async () => {
      const allblogsAfterDeleteResponse = await request(app.getHttpServer())
        .get('/blogs/')
        .send()
        .expect(200);
      expect(allblogsAfterDeleteResponse.body.items.length).toBe(0);
    });
  });

  describe('check pagination', () => {
    it('should correct paginate data', async () => {
      await request(app.getHttpServer()).delete('/testing/all-data');
      //create 11 blogs,
      for (let i = 0; i <= 10; i++) {
        await request(app.getHttpServer())
          .post('/blogs')
          .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
          .send({
            name: `blog${i}`,
            youtubeUrl: 'https://youtube.com',
          });
      }
      const allBlogsResponse = await request(app.getHttpServer())
        .get('/blogs/')
        .send()
        .expect(200);
      expect(allBlogsResponse.body).toBeDefined();
      const blogs = allBlogsResponse.body;
      expect(blogs.totalCount).toBe(11);
      expect(blogs.pageSize).toBe(10);
      expect(blogs.pagesCount).toBe(2);
    });
  });
});
