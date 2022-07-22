import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentType, PostType } from '../../types/types';
import { Pagination } from '../common/pagination.service';
import { CommentsService } from '../comments/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
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

  @Post('/')
  async createPost(@Param() newPost: PostType) {
    //does not find blogger for check 404
    return await this.postsService.createPost(newPost);
  }

  @Post('/:postId/comments')
  async createPostByPostId(
    @Param('postId') postId: string,
    @Body() commentToCreateData: CommentType,
  ) {
    return 'Created new comment';
  }

  @Put('/:postId')
  async updatePostById(
    @Param('postId') postId: string,
    @Body() postToUpdateData: PostType,
  ) {
    return await this.postsService.updatePostById(postId, postToUpdateData);
  }

  @Delete('/postId')
  async deletePostById(@Param('postId') postId: string) {
    await this.postsService.deletePostById(postId);
  }
}
