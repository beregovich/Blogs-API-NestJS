import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeAction } from '../../../types/types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async updateCommentLike(
    id: string,
    likeStatus: LikeAction,
    userId: string,
    postId: string,
    addedAt: Date,
  ) {
    try {
      const result = await this.dataSource.query(
        `
    INSERT INTO "CommentsLikes" ("id", "userId", "likeStatus", "addedAt", "postId")
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
}
