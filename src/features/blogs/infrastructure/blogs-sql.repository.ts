import { BlogType, EntityWithPaginationType } from '../../../types/types';

import { Injectable, NotFoundException } from '@nestjs/common';
import { IBlogsRepository } from '../application/blogs.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsSqlRepository implements IBlogsRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getBlogs(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<BlogType[]>> {
    const searchTerm = searchNameTerm ? searchNameTerm : '';
    const blog = await this.dataSource.query(
      `
    SELECT to_jsonb("blogs") FROM "blogs"
    WHERE "name" like $3
    ORDER BY "name" DESC
    OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
    `,
      [(page - 1) * pageSize, pageSize, `%${searchTerm}%`],
    );
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(name) FROM public."blogs"
              WHERE "name" like $1`,
      [`%${searchTerm}%`],
    );
    const items: BlogType[] = [];
    blog.forEach((b) => items.push(b.to_jsonb));
    const pagesCount = Math.ceil(totalCount[0].count / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount: parseInt(totalCount[0].count),
      items,
    };
  }

  async getBlogById(blogId: string): Promise<BlogType | null> {
    const blog = await this.dataSource.query(
      `
      SELECT to_jsonb("blogs") FROM "blogs"
      WHERE id = $1
      `,
      [blogId],
    );
    if (blog) {
      return blog[0].to_jsonb;
    } else return null;
  }

  async createBlog(newblog: BlogType) {
    try {
      const result = await this.dataSource.query(
        `
    INSERT INTO "blogs" ("id", "name", "youtubeUrl")
    VALUES ($1, $2, $3)
    RETURNING ("id", "name", "youtubeUrl");
    `,
        [newblog.id, newblog.name, newblog.youtubeUrl],
      );
      const blog = await this.dataSource.query(
        `
      SELECT to_jsonb("blogs") FROM "blogs"
      WHERE id = $1
      `,
        [newblog.id],
      );
      return blog[0].to_jsonb;
    } catch (e) {
      throw new NotFoundException({ error: e });
    }
  }

  async updateBlogById(id: string, name: string, youtubeUrl: string) {
    const result = await this.dataSource.query(
      `
    UPDATE "blogs"
    SET "name"=$1, "youtubeUrl"=$2
    WHERE id = $3
    `,
      [name, youtubeUrl, id],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
    DELETE FROM "blogs"
    WHERE id = $1
    `,
      [id],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }
}
