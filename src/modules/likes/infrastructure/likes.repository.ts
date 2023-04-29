import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { LikeAction } from '../../../types/types';
import { CommentsLikesDocument, PostsLikesDocument } from './likes.schema';
import { Model } from 'mongoose';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel('PostsLikes')
    private readonly postsLikes: Model<PostsLikesDocument>,
    @InjectModel('CommentsLikes')
    private readonly commentsLikes: Model<CommentsLikesDocument>,
    @InjectModel('Posts') private readonly postsModel,
  ) {}

  async updatePostLike(
    action: LikeAction,
    userId: string,
    postId: string,
    lastActionAt: Date,
  ) {
    if (action == LikeAction.None) {
      await this.postsLikes.deleteOne({ userId, postId });
    } else {
      const result = await this.postsLikes.updateOne(
        { userId, postId },
        {
          $set: {
            action: action,
            userId: userId,
            postId: postId,
            lastActionAt,
          },
        },
        { upsert: true },
      );
      await this.postsModel.updateOne(
        { id: postId },
        { $push: { PostsLikes: result.upsertedId } },
      );
      return result;
    }
    return;
  }

  async updateCommentLike(
    action: LikeAction,
    userId: string,
    commentId: string,
  ) {
    if (action == LikeAction.None) {
      await this.commentsLikes.deleteOne({ userId, commentId });
    } else {
      await this.commentsLikes.updateOne(
        { userId, commentId },
        { $set: { action, lastActionAt: new Date() } },
      );
    }
    return null;
  }

  async getPostLikes(postId: string, userId: string | null) {
    const likesCountsData = await this.postsLikes.aggregate([
      { $match: { postId } },
      { $group: { _id: '$action', count: { $count: {} } } },
    ]);
    const likesCount = likesCountsData.find((pl) => pl._id === 'Like').count;
    const dislikeCount = likesCountsData.find(
      (pl) => pl._id === 'Dislike',
    ).count;
    const lastLikes = await this.postsLikes
      .find({ action: LikeAction.Like })
      .sort({ x: -1 })
      .limit(3)
      .lean();
    if (userId) {
      const usersLike = await this.postsLikes.findOne({ userId }).lean();
      return {
        likesCount,
        dislikeCount,
        myStatus: usersLike.action ? usersLike.action : 'None',
      };
    }
    return {
      likesCount,
      dislikeCount,
      myStatus: 'None',
    };
    // return {
    //   likesCount: 0,
    //   dislikesCount: 0,
    //   myStatus: 'None',
    //   newestLikes: [
    //     {
    //       addedAt: '2022-07-27T19:47:00.456Z',
    //       userId: 'string',
    //       login: 'string',
    //     },
    //   ],
    // };
  }

  async getCommentLikes(commentId: string, userId: string | null) {
    const likesCountsData = await this.commentsLikes.aggregate([
      { $match: { commentId } },
      { $group: { _id: '$action', count: { $count: {} } } },
    ]);
    const likesCount = likesCountsData.find((e) => e._id === 'Like').count;
    const dislikeCount = likesCountsData.find((e) => e._id === 'Dislike').count;
    if (userId) {
      const usersLike = await this.commentsLikes.findOne({ userId }).lean();
      return {
        likesCount,
        dislikeCount,
        myStatus: usersLike.action ? usersLike.action : 'None',
      };
    }
    return {
      likesCount,
      dislikeCount,
      myStatus: 'None',
    };
  }
}
