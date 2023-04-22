import { BlogType, EntityWithPaginationType } from '../../../types/types';

import { Injectable, NotFoundException } from '@nestjs/common';
import { IBlogsRepository } from '../application/blogs.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogsTypeOrmRepository implements IBlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  //2nd No metadata for blog
  // private readonly blogRepo: Repository<blog>;
  // constructor(
  //   @InjectDataSource()
  //   private readonly dataSource: DataSource,
  // ) {
  //   this.blogRepo = this.dataSource.getRepository<blog>(blog);
  // }

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
    try {
      console.log('trying getblogById');
      const blog = await this.blogRepo.findOneBy({ id: blogId });
      if (!blog) {
        return null;
      }
      return blog;
    } catch (e) {
      console.log('getblogById error: ' + e);
    }
  }

  async createBlog(newblog: BlogType) {
    const blog = new Blog();
    blog.id = newblog.id;
    blog.name = newblog.name;
    blog.youtubeUrl = newblog.youtubeUrl;
    const result = await this.blogRepo.save(blog);
    console.log(result);
    return result;
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
