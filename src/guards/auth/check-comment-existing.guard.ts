import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from '../../features/posts/posts.service';
import { CommentsService } from '../../features/comments/comments.service';

@Injectable()
export class CheckCommentExistingGuard implements CanActivate {
  constructor(private commentsService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request: Request = context.switchToHttp().getRequest();
    const commentId = request.params.commentId;
    const comment = await this.commentsService.getCommentById(commentId, null);
    if (!comment)
      throw new NotFoundException({
        message: 'comment not found',
        field: 'commentId',
      });
    return true;
  }
}
