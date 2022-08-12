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
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentType, LikeAction, PostType } from '../../types/types';
import { Pagination } from '../../infrastructure/common/pagination.service';
import { CommentsService } from '../comments/comments.service';
import { BaseAuthGuard } from '../auth/guards/base-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayloadExtractorGuard } from '../../guards/common/jwt-payload-extractor.guard';
import { CheckPostExistingGuard } from '../../guards/auth/check-post-existing.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}
  @UseGuards(JwtPayloadExtractorGuard)
  @Get('/')
  async getPosts(@Query() query, @Request() req) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    const userId = req.user.userId || null;
    return await this.postsService.getPosts(
      page,
      pageSize,
      searchNameTerm,
      null,
      userId,
    );
  }
  @HttpCode(200)
  @UseGuards(JwtPayloadExtractorGuard)
  @Get('/:id')
  async getPostById(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId || null;
    return await this.postsService.getPostById(id, userId);
  }

  @UseGuards(JwtPayloadExtractorGuard)
  @Get(':postId/comments')
  async getCommentsByPostId(
    @Query() query,
    @Param('postId') postId: string,
    @Request() req,
  ) {
    const paginationData = Pagination.getPaginationData(query);
    const userId = req.user.userId || null;
    const comments = await this.commentsService.getCommentsByPostId(
      paginationData,
      postId,
      userId,
    );
    return comments;
  }

  @UseGuards(BaseAuthGuard)
  @Post('/')
  async createPost(@Body() newPost: PostType) {
    //does not find blogger for check 404
    return await this.postsService.createPost(newPost);
  }
  @UseGuards(JwtPayloadExtractorGuard)
  @Post('/:postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    const userLogin = req.user.login;
    const userId = req.user.userId;
    const newComment = await this.commentsService.createComment(
      content,
      postId,
      userLogin,
      userId,
    );
    return newComment;
  }
  @HttpCode(201)
  @UseGuards(BaseAuthGuard)
  @Put('/:postId')
  async updatePostById(
    @Param('postId') postId: string,
    @Body() postToUpdateData: PostType,
  ) {
    return await this.postsService.updatePostById(postId, postToUpdateData);
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(CheckPostExistingGuard)
  @HttpCode(204)
  @Put('/:postId/like-status')
  async updatePostLike(
    @Param('postId') postId: string,
    @Body('likeStatus') likeStatus: string,
    @Request() req,
  ) {
    console.log(LikeAction[likeStatus]);
    await this.postsService.updatePostLike(
      LikeAction[likeStatus],
      req.user.userId,
      postId,
    );
    return;
  }
  @UseGuards(BaseAuthGuard)
  @Delete('/:postId')
  async deletePostById(@Param('postId') postId: string) {
    await this.postsService.deletePostById(postId);
  }
}
