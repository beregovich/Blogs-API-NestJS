import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { BloggerType, EntityWithPaginationType } from '../../../types/types';
import { BloggersRepository } from '../infrastructure/bloggers.repository';
import { BloggersSqlRepository } from '../infrastructure/bloggers-sql.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class BloggersService {
  //constructor(private bloggersRepository: BloggersRepository) {}
  constructor(private bloggersRepository: BloggersRepository) {}

  async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
    return this.bloggersRepository.getBloggers(page, pageSize, searchNameTerm);
  }

  async getBloggerById(id: string): Promise<BloggerType | null> {
    const blogger = this.bloggersRepository.getBloggerById(id);
    if (!blogger)
      throw new BadRequestException({
        field: 'id',
        message: 'blogger not found',
      });
    return blogger;
  }

  async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
    const bloggerToPush = {
      id: uuidv4(),
      name,
      youtubeUrl,
    };
    return this.bloggersRepository.createBlogger(bloggerToPush);
  }

  async updateBloggerById(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<BloggerType | boolean> {
    const isUpdated = this.bloggersRepository.updateBloggerById(
      id,
      name,
      youtubeUrl,
    );
    return isUpdated;
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    return this.bloggersRepository.deleteBloggerById(id);
  }
}

export interface IBloggersRepository {
  getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<BloggerType[]>>;

  getBloggerById(id: string): Promise<BloggerType | null>;

  createBlogger(newBlogger: BloggerType): Promise<BloggerType>;

  updateBloggerById(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<BloggerType | boolean>;

  deleteBloggerById(id: string): Promise<boolean>;
}
