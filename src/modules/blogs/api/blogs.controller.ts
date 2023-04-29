import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { Pagination } from '../../../infrastructure/common/pagination.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { CommentsService } from '../../comments/comments.service';
import { BaseAuthGuard } from '../../auth/guards/base-auth.guard';
import { PostType } from '../../../types/types';
import { PostsService } from '../../posts/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtPayloadExtractorGuard } from '../../../guards/common/jwt-payload-extractor.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {}
  @Get()
  async getBlogs(@Query() query, @Request() req) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    const request = req;
    const blogs = await this.blogsService.getBlogs(
      page,
      pageSize,
      searchNameTerm,
    );
    return blogs;
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogsService.getBlogById(id);
  }
  @UseGuards(JwtPayloadExtractorGuard)
  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query,
    @Request() req,
  ) {
    const paginationData = Pagination.getPaginationData(query);
    const userId = req.user.userId || null;
    const posts = await this.postsService.getPosts(
      paginationData.page,
      paginationData.pageSize,
      paginationData.searchNameTerm,
      blogId,
      userId,
    );
    return posts;
  }
  @UseGuards(BaseAuthGuard)
  @Post()
  async createBlog(@Body() blogDto: CreateBlogDto) {
    const newBlog = await this.blogsService.createBlog(
      blogDto.name,
      blogDto.youtubeUrl,
    );
    return newBlog;
  }
  @UseGuards(BaseAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() newPost: CreatePostDto,
  ) {
    return await this.postsService.createPost({
      ...newPost,
      blogId: blogId,
    });
  }
  @UseGuards(BaseAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateBlog(@Param('id') id: string, @Body() blogUpdateData) {
    const updatedBlog = await this.blogsService.updateBlogById(
      id,
      blogUpdateData.name,
      blogUpdateData.youtubeUrl,
    );
    return updatedBlog; // shouldn't return any data according SWAGGER
  }
  @UseGuards(BaseAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    const result = await this.blogsService.deleteBlogById(id);
    return result; // shouldn't return any data according SWAGGER
  }
}
