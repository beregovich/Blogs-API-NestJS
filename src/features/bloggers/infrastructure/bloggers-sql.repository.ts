import { BloggerType, EntityWithPaginationType } from '../../../types/types';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBloggersRepository } from '../application/bloggers.service';
import { InjectModel } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BloggersSqlRepository implements IBloggersRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectModel('Bloggers') private bloggersModel,
    @InjectModel('Posts') private postsModel,
  ) {}

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
      totalCount: totalCount[0].count,
      items,
    };
  }

  async getBloggerById(bloggerId: string): Promise<BloggerType | null> {
    const blogger = await this.dataSource.query(
      `
      SELECT to_jsonb("Bloggers") FROM "Bloggers"
      WHERE id = $1
      `,
      [bloggerId],
    );
    if (blogger) {
      return blogger[0].to_jsonb;
    } else return null;
  }

  async createBlogger(newBlogger: BloggerType) {
    try {
      const result = await this.dataSource.query(
        `
    INSERT INTO "Bloggers" ("id", "name", "youtubeUrl")
    VALUES ($1, $2, $3)
    RETURNING ("id", "name", "youtubeUrl");
    `,
        [newBlogger.id, newBlogger.name, newBlogger.youtubeUrl],
      );
      const blogger = await this.dataSource.query(
        `
      SELECT to_jsonb("Bloggers") FROM "Bloggers"
      WHERE id = $1
      `,
        [newBlogger.id],
      );
      return blogger[0].to_jsonb;
    } catch (e) {
      throw new NotFoundException({ error: e });
    }
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
    // await this.postsModel.updateMany(
    //   { bloggerId: id },
    //   {
    //     $set: {
    //       bloggerName: name,
    //     },
    //   },
    // );
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
