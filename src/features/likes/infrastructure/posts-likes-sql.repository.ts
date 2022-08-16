import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { LikeAction } from '../../../types/types';
import { CommentsLikesDocument, PostsLikesDocument } from './likes.schema';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async updatePostLike(
    id: string,
    likeStatus: LikeAction,
    userId: string,
    postId: string,
    addedAt: Date,
  ) {
    try {
      const result = await this.dataSource.query(
        `
    INSERT INTO "PostsLikes" ("id", "userId", "likeStatus", "addedAt", "postId")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ("id", "userId", "likeStatus", "addedAt", "postId");
    `,
        [id, userId, likeStatus, addedAt, postId],
      );
    } catch (e) {
      throw new NotFoundException({ error: e });
    }
    return;
  }

  async getPostLikes(postId: string, userId: string | null) {
    return;
  }
}
