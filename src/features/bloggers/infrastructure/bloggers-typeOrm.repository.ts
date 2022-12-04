import { BloggerType, EntityWithPaginationType } from '../../../types/types';

import { Injectable, NotFoundException } from '@nestjs/common';
import { IBloggersRepository } from '../application/bloggers.service';
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Blogger } from "../entities/blogger.entity";

@Injectable()
export class BloggersTypeOrmRepository implements IBloggersRepository {
  constructor(
    @InjectRepository(Blogger)
    private readonly bloggerRepo: Repository<Blogger>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
  }
  //2nd No metadata for Blogger
  // private readonly bloggerRepo: Repository<Blogger>;
  // constructor(
  //   @InjectDataSource()
  //   private readonly dataSource: DataSource,
  // ) {
  //   this.bloggerRepo = this.dataSource.getRepository<Blogger>(Blogger);
  // }

  async getBloggers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<BloggerType[]>> {
    const searchTerm = searchNameTerm ? searchNameTerm : '';
    const blogger = await this.dataSource.query(
      `
    SELECT to_jsonb("Bloggers") FROM "Bloggers"
    WHERE "name" like $3
    ORDER BY "name" DESC
    OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
    `,
      [(page - 1) * pageSize, pageSize, `%${searchTerm}%`],
    );
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(name) FROM public."Bloggers"
              WHERE "name" like $1`,
      [`%${searchTerm}%`],
    );
    const items: BloggerType[] = [];
    blogger.forEach((b) => items.push(b.to_jsonb));
    const pagesCount = Math.ceil(totalCount[0].count / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount: parseInt(totalCount[0].count),
      items,
    };
  }

  async getBloggerById(bloggerId: string): Promise<BloggerType | null> {
    try {
      console.log('trying getBloggerById')
      const blogger = await this.bloggerRepo.findOneBy({id: bloggerId})
      if (!blogger) {
        return null
      }
      return blogger;
    } catch (e) {
      console.log('getBloggerById error: ' + e);
    }
  }

  async createBlogger(newBlogger: BloggerType) {
    const blogger = new Blogger();
    blogger.id = newBlogger.id;
    blogger.name = newBlogger.name;
    blogger.youtubeUrl = newBlogger.youtubeUrl;
    const result = await this.bloggerRepo.save(blogger);
    console.log(result);
    return result;
  }

  async updateBloggerById(id: string, name: string, youtubeUrl: string) {
    const result = await this.dataSource.query(
      `
    UPDATE "Bloggers"
    SET "name"=$1, "youtubeUrl"=$2
    WHERE id = $3
    `,
      [name, youtubeUrl, id],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
    DELETE FROM "Bloggers"
    WHERE id = $1
    `,
      [id],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }
}
