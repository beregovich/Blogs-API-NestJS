import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { LikeAction } from '../../../../types/types';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}
  async updatePostLike(action: LikeAction, userId: string, postId: string) {
    await this.likesRepository.updatePostLike(action, userId, postId);
    return;
  }
  async updateCommentLike(
    action: LikeAction,
    userId: string,
    commentId: string,
  ) {
    await this.likesRepository.updateCommentLike(action, userId, commentId);
    return;
  }
  async getCommentLikesData(commentId: string) {
    const commentLikes = await this.likesRepository.getCommentLikes(
      commentId,
      null,
    );
    return commentLikes;
  }
}
