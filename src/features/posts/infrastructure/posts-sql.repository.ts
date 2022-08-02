import { PostType } from '../../../types/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IPostsRepository } from '../posts.service';

import { InjectModel } from '@nestjs/mongoose';
import { BloggersService } from '../../bloggers/application/bloggers.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsSqlRepository implements IPostsRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    bloggerId: string | null,
  ) {
    const filterByBlogger = bloggerId ? bloggerId : '';
    const totalCount = await this.dataSource.query(
      `SELECT COUNT(id) FROM public."Posts"
              WHERE "title" like $1 
              AND "bloggerId" like $2`,
      [`%${searchNameTerm}%`, `%${filterByBlogger}%`],
    );
    const pagesCount = Math.ceil(totalCount[0].count / pageSize);
    const allPosts = await this.dataSource.query(
      `
    SELECT to_jsonb("Posts") FROM "Posts"
    WHERE "title" like $1
    AND "bloggerId" like $2
    ORDER BY "title" DESC
    OFFSET $3 ROWS FETCH NEXT $4 ROWS ONLY
    `,
      [
        `%${searchNameTerm}%`,
        `%${filterByBlogger}%`,
        (page - 1) * pageSize,
        pageSize,
      ],
    );
    const items: PostType[] = [];
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: allPosts,
    };
  }

  async getPostById(id: string) {
    const post = await this.dataSource.query(
      `
      SELECT to_jsonb("Posts"),
         (SELECT name FROM "Bloggers"
         WHERE "bloggerId" = Posts.bloggerId) AS bloggerName
      FROM "Bloggers"
      WHERE "id" = $1
      `,
      [id],
    );
    if (post) {
      return post[0].to_jsonb;
    } else return null;
    if (!post) return false;
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName: post.bloggerName,
    };
  }

  async getPostWithLikesById(id: string) {
    return null;
  }

  async createPost(newPost: PostType): Promise<PostType | null> {
    try {
      await this.dataSource.query(
        `
    INSERT INTO "POSTS" ("id", "title", "shortDescription", "content", "bloggerId")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ("id", "title", "shortDescription", "content", "bloggerId");
    `,
        [
          newPost.id,
          newPost.title,
          newPost.shortDescription,
          newPost.content,
          newPost.bloggerId,
        ],
      );
      const blogger = await this.dataSource.query(
        `
      SELECT to_jsonb("Posts") FROM "Posts"
      WHERE id = $1
      `,
        [newPost.id],
      );
      return blogger[0].to_jsonb;
    } catch (e) {
      throw new NotFoundException({ error: e });
    }
  }

  async updatePostById(id: string, newPost: PostType) {
    const result = await this.dataSource.query(
      `
    UPDATE "Posts"
    SET "title"=$1, 
    "shortDescription"=$2, 
    "content"=$3, 
    "bloggerId"=$4
    WHERE id = $5
    `,
      [
        newPost.title,
        newPost.shortDescription,
        newPost.content,
        newPost.bloggerId,
        id,
      ],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }

  async deletePostById(id: string) {
    const result = await this.dataSource.query(
      `
    DELETE FROM "Posts"
    WHERE id = $1
    `,
      [id],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }
}
