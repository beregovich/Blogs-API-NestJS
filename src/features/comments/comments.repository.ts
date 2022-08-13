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
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

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
    const formattedComments = comments.map((comment) => {
      const likes = comment.likesInfo;
      const currentUserLikeStatus = likes.find((l) => l.userId === userId);
      const likesCount = likes.filter((l) => l.action === 'Like').length;
      const dislikesCount = likes.filter((l) => l.action === 'Dislike').length;
      return {
        ...comment,
        likesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: currentUserLikeStatus
            ? currentUserLikeStatus.action
            : 'None',
        },
      };
    });
    return {
      pagesCount,
      page: paginationData.page,
      pageSize: paginationData.pageSize,
      totalCount,
      items: formattedComments,
    };
  }

  async createComment(newComment: CommentType): Promise<CommentType | null> {
    await this.commentsModel.create(newComment);
    const createdComment = await this.getCommentById(
      newComment.id,
      newComment.userId,
    );
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
    const comment = await this.commentsModel
      .findOne({ id: commentId }, { _id: 0, postId: 0, __v: 0 })
      .lean();
    if (!comment) throw new NotFoundException();
    const likes = comment.likesInfo;
    const currentUserLikeStatus = likes.find((l) => l.userId === userId);
    const likesCount = likes.filter((l) => l.action === 'Like').length;
    const dislikesCount = likes.filter((l) => l.action === 'Dislike').length;
    const likesInfo = {
      likesCount,
      dislikesCount,
      myStatus: 'None',
    };
    return {
      ...comment,
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus: currentUserLikeStatus ? currentUserLikeStatus.action : 'None',
      },
    };
  }

  async updateLikeByCommentId(
    commentId: string,
    likeStatus: string,
    userId: string,
    addedAt: Date,
  ) {
    if (
      likeStatus == LikeAction.Like ||
      likeStatus == LikeAction.Dislike ||
      likeStatus == LikeAction.None
    ) {
      await this.commentsModel.updateOne(
        {
          id: commentId,
        },
        { $pull: { likesInfo: { userId } } },
      );
    } else {
      throw new HttpException(
        { message: [{ field: 'likeStatus', message: 'wrong value' }] },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (likeStatus == LikeAction.Like || likeStatus == LikeAction.Dislike) {
      const user = await this.usersService.getUserById(userId);
      if (!user) throw new NotFoundException('User from jwt not found');
      const result = this.commentsModel.updateOne(
        { id: commentId },
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
      if (result.matchedCount == 0) throw new BadRequestException();
      return result;
    }
  }
}
