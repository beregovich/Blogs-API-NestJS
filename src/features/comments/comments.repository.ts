import mongoose from 'mongoose';
import {
  CommentType,
  EntityWithPaginationType,
  LikeAction,
  QueryDataType,
} from '../../types/types';
import { ICommentsRepository } from './comments.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(
    @InjectModel('Comments') private commentsModel,
    private readonly usersService: UsersService,
  ) {}

  async getCommentsByPostId(
    paginationData: QueryDataType,
    postId: string | null,
    userId: string | null,
  ): Promise<EntityWithPaginationType<CommentType[]>> {
    const filter = postId
      ? {
          content: {
            $regex: paginationData.searchNameTerm
              ? paginationData.searchNameTerm
              : '',
          },
          postId,
        }
      : {
          content: {
            $regex: paginationData.searchNameTerm
              ? paginationData.searchNameTerm
              : '',
          },
        };
    const comments = await this.commentsModel
      .find(filter, { _id: 0, postId: 0, __v: 0 })
      .skip((paginationData.page - 1) * paginationData.pageSize)
      .limit(paginationData.pageSize)
      .lean();
    const totalCount = await this.commentsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / paginationData.pageSize);
    return {
      pagesCount,
      page: paginationData.page,
      pageSize: paginationData.pageSize,
      totalCount,
      items: comments,
    };
  }

  async createComment(newComment: CommentType): Promise<CommentType | null> {
    this.commentsModel.create(newComment);
    const createdComment = this.commentsModel
      .findOne({ id: newComment.id }, { _id: 0, postId: 0, __v: 0 })
      .lean();
    return createdComment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.commentsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await this.commentsModel.updateOne(
      { id },
      { $set: { content: content } },
    );
    return result.matchedCount === 1;
  }

  async getCommentById(commentId: string, userId: string | null) {
    const comment = await this.commentsModel.findOne(
      { id: commentId },
      { projection: { _id: 0, postId: 0 } },
    );
    if (!comment) throw new NotFoundException();
    const likes = comment.likesInfo;
    const likesCount = likes.filter((l) => l.action === 'Dislike').length;
    const dislikesCount = likes.filter((l) => l.action === 'Dislike').length;
    const likesInfo = {
      likesCount,
      dislikesCount,
      myStatus: 'None',
    };
    return {
      ...comment,
      likesInfo,
    };
  }

  async updateLikeByCommentId(
    commentId: string,
    likeStatus: string,
    userId: string,
    addedAt: Date,
  ) {
    if (
      likeStatus == LikeAction.None ||
      likeStatus == LikeAction.Like ||
      likeStatus == LikeAction.Dislike
    ) {
      await this.commentsModel.updateOne(
        {
          commentId,
        },
        { $pull: { likesInfo: { userId } } },
      );
      const user = await this.usersService.getUserById(userId);
      if (!user) throw new NotFoundException();
      await this.commentsModel.updateOne(
        { commentId },
        {
          $pull: {
            likesInfo: { userId },
          },
        },
      );
      const result = this.commentsModel.updateOne(
        { commentId },
        {
          $push: {
            likesInfo: {
              action: likeStatus,
              userId: userId,
              login: user.accountData.login,
              addedAt,
            },
          },
        },
      );
      // const result = this.commentsModel.findAndModify({
      //   query: { commentId },
      //   update: {
      //     $push: {
      //       likesInfo: {
      //         action: likeStatus,
      //         userId: userId,
      //         login: user.accountData.login,
      //         addedAt,
      //       },
      //     },
      //   },
      // });
      if (result.matchedCount == 0) throw new BadRequestException();
      return result;
    } else {
      throw new BadRequestException();
    }
  }
}
