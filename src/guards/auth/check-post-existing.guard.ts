import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from '../../modules/posts/posts.service';

@Injectable()
export class CheckPostExistingGuard implements CanActivate {
  constructor(private postsService: PostsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request: Request = context.switchToHttp().getRequest();
    const postId = request.params.postId;
    const post = await this.postsService.getPostById(postId, null);
    if (!post)
      throw new NotFoundException({
        message: 'post not found',
        field: 'postId',
      });
    return true;
  }
}
