import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { BlogType, EntityWithPaginationType } from '../../../types/types';

@Injectable({ scope: Scope.TRANSIENT })
export class BlogsService {
  constructor(
    @Inject('BlogsRepository')
    private blogsRepository: IBlogsRepository,
  ) {}

  async getBlogs(page: number, pageSize: number, searchNameTerm: string) {
    return this.blogsRepository.getBlogs(page, pageSize, searchNameTerm);
  }

  async getBlogById(id: string): Promise<BlogType | null> {
    const blog = this.blogsRepository.getBlogById(id);
    if (!blog)
      throw new BadRequestException({
        field: 'id',
        message: 'blog not found',
      });
    return blog;
  }

  async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
    const blogToPush = {
      id: uuidv4(),
      name,
      youtubeUrl,
    };
    return this.blogsRepository.createBlog(blogToPush);
  }

  async updateBlogById(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<BlogType | boolean> {
    const isUpdated = this.blogsRepository.updateBlogById(id, name, youtubeUrl);
    return isUpdated;
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlogById(id);
  }
}

export interface IBlogsRepository {
  getBlogs(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<BlogType[]>>;

  getBlogById(id: string): Promise<BlogType | null>;

  createBlog(newblog: BlogType): Promise<BlogType>;

  updateBlogById(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<BlogType | boolean>;

  deleteBlogById(id: string): Promise<boolean>;
}
