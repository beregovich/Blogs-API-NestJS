import mongoose from 'mongoose';
import {
  CommentType,
  EntityWithPaginationType,
  QueryDataType,
} from '../../types/types';
import { ICommentsRepository } from './comments.service';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(@InjectModel('Comments') private commentsModel) {}

  async getCommentsByPostId(
    paginationData: QueryDataType,
    postId: string | null,
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
      .find(filter, { projection: { _id: 0, postId: 0 } })
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
      .findOne({ id: newComment.id }, { projection: { _id: 0, postId: 0 } })
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

  async getCommentById(commentId: string) {
    const comment = await this.commentsModel.findOne(
      { id: commentId },
      { projection: { _id: 0, postId: 0 } },
    );
    if (!comment) return null;
    return comment;
  }
}
