import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentType, LikeAction, PostType } from '../../types/types';
import { Pagination } from '../../infrastructure/common/pagination.service';
import { CommentsService } from '../comments/comments.service';
import { BaseAuthGuard } from '../auth/guards/base-auth.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LikesService } from '../likes/application/likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}

  @Get('/')
  async getPosts(@Query() query) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    return await this.postsService.getPosts(
      page,
      pageSize,
      searchNameTerm,
      null,
    );
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostById(id);
  }

  @Get(':postId/comments')
  async getCommentsByPostId(@Query() query, @Param('postId') postId: string) {
    const paginationData = Pagination.getPaginationData(query);
    const comments = await this.commentsService.getCommentsByPostId(
      paginationData,
      postId,
    );
    return comments;
  }
  @UseGuards(BaseAuthGuard)
  @Post('/')
  async createPost(@Body() newPost: PostType) {
    //does not find blogger for check 404
    return await this.postsService.createPost(newPost);
  }
  @UseGuards(AuthGuard)
  @Post('/:postId/comments')
  async createPostByPostId(
    @Param('postId') postId: string,
    @Body() commentToCreateData: CommentType,
  ) {
    return 'Created new comment';
  }
  @UseGuards(BaseAuthGuard)
  @Put('/:postId')
  async updatePostById(
    @Param('postId') postId: string,
    @Body() postToUpdateData: PostType,
  ) {
    return await this.postsService.updatePostById(postId, postToUpdateData);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/:postId/like-status')
  async updatePostLike(
    @Param('postId') postId: string,
    @Body('likeStatus') likeStatus: string,
    @Request() req,
  ) {
    return await this.likesService.updatePostLike(
      LikeAction[likeStatus],
      req.user.userId,
      postId,
    );
  }
  @UseGuards(BaseAuthGuard)
  @Delete('/postId')
  async deletePostById(@Param('postId') postId: string) {
    await this.postsService.deletePostById(postId);
  }
}
