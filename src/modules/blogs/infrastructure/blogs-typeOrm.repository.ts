import { BlogType, EntityWithPaginationType } from '../../../types/types';

import { Injectable, NotFoundException } from '@nestjs/common';
import { IBlogsRepository } from '../application/blogs.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogsRepository implements IBlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getBlogs(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<BlogType[]>> {
    return {
      pagesCount: 0,
      page,
      pageSize,
      totalCount: 0,
      items: [],
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
