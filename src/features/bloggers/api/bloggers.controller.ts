import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BloggersService } from '../application/bloggers.service';
import { Pagination } from '../../../infrastructure/common/pagination.service';
import { CreateBloggerDto } from '../dto/create-blogger.dto';
import { CommentsService } from '../../comments/comments.service';
import { BaseAuthGuard } from '../../auth/guards/base-auth.guard';

@Controller('bloggers')
export class BloggersController {
  constructor(
    private bloggersService: BloggersService,
    private commentsService: CommentsService,
  ) {}
  @Get()
  async getBloggers(@Query() query) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    const bloggers = await this.bloggersService.getBloggers(
      page,
      pageSize,
      searchNameTerm,
    );
    return bloggers;
  }

  @Get(':id')
  async getBloggerById(@Param('id') id: string) {
    const blogger = await this.bloggersService.getBloggerById(id);
    //if (!blogger) throw new NotFoundException();
    return blogger;
  }

  @Get(':bloggerId/posts')
  async getPostsByBloggerId(@Param('id') id: string, @Query() query) {
    const paginationData = Pagination.getPaginationData(query);
    const posts = await this.commentsService.getCommentsByPostId(
      paginationData,
      id,
    );
    return posts;
  }
  @UseGuards(BaseAuthGuard)
  @Post()
  async createBlogger(@Body() bloggerDto: CreateBloggerDto) {
    const newBlogger = await this.bloggersService.createBlogger(
      bloggerDto.name,
      bloggerDto.youtubeUrl,
    );
    return newBlogger;
  }
  @UseGuards(BaseAuthGuard)
  @Post(':bloggerId/posts')
  async createPostByBloggerId(@Param('bloggerId') bloggerId: string) {
    return 'Coming soon';
  }
  @UseGuards(BaseAuthGuard)
  @Put(':id')
  async updateBlogger(@Param('id') id: string, @Body() bloggerUpdateData) {
    const updatedBlogger = await this.bloggersService.updateBloggerById(
      id,
      bloggerUpdateData.name,
      bloggerUpdateData.youtubeurl,
    );
    return updatedBlogger; // shouldn't return any data according SWAGGER
  }
  @UseGuards(BaseAuthGuard)
  @Delete(':id')
  async deleteBloggerById(@Param('id') id: string) {
    const result = await this.bloggersService.deleteBloggerById(id);
    return result; // shouldn't return any data according SWAGGER
  }
}
