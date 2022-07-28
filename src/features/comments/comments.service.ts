import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  CommentType,
  EntityWithPaginationType,
  QueryDataType,
} from '../../types/types';
import { CommentsRepository } from './comments.repository';
import { LikesService } from '../likes/entities/application/likes.service';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private readonly likesService: LikesService,
  ) {}

  async getCommentsByPostId(
    paginationData: QueryDataType,
    PostId: string | null,
  ) {
    const comments = this.commentsRepository.getCommentsByPostId(
      paginationData,
      PostId,
    );
    const likesData = await this.likesService;
    return comments;
  }

  async getCommentById(commentId: string) {
    const result = this.commentsRepository.getCommentById(commentId);
    return result;
  }

  async updateCommentById(commentId: string, content: string) {
    const comment = this.commentsRepository.updateCommentById(
      commentId,
      content,
    );
    return comment;
  }

  async createComment(
    content: string,
    postId: string,
    userLogin: string,
    userId: string,
  ) {
    const newComment = {
      id: uuidv4(),
      content,
      userId,
      postId,
      userLogin,
      addedAt: new Date(),
    };
    const result = this.commentsRepository.createComment(newComment);
    return result;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.commentsRepository.deleteComment(id);
  }
}

export interface ICommentsRepository {
  getCommentsByPostId(
    paginationData: QueryDataType,
    PostId: string | null,
  ): Promise<EntityWithPaginationType<CommentType[]>>;

  getCommentById(commentId: string): Promise<CommentType | null>;

  updateCommentById(commentId: string, content: string): any;

  createComment(newComment: CommentType): Promise<CommentType | null>;

  deleteComment(id: string): Promise<boolean>;
}
