import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { Pagination } from '../common/pagination.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';

@Controller('bloggers')
export class BloggersController {
  constructor(private bloggersService: BloggersService) {}
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
    return await this.bloggersService.getBloggerById(id);
  }

  @Get(':bloggerId/posts')
  async getPostsByBloggerId(@Param('id') id: string, @Query() query) {
    const { page, pageSize, searchNameTerm } =
      Pagination.getPaginationData(query);
    return "blogger's posts";
  }

  @Post()
  async createBlogger(@Body() bloggerDto: CreateBloggerDto) {
    const newBlogger = await this.bloggersService.createBlogger(
      bloggerDto.name,
      bloggerDto.youtubeUrl,
    );
    return newBlogger;
  }

  @Post(':bloggerId/posts')
  async createPostByBloggerId(@Param('bloggerId') bloggerId: string) {
    return 'Coming soon';
  }

  @Put(':id')
  async updateBlogger(@Param('id') id: string, @Body() bloggerUpdateData) {
    const updatedBlogger = await this.bloggersService.updateBloggerById(
      id,
      bloggerUpdateData.name,
      bloggerUpdateData.youtubeurl,
    );
    return updatedBlogger; // shouldn't return any data according SWAGGER
  }
  @Delete(':id')
  async deleteBloggerById(@Param('id') id: string) {
    const result = await this.bloggersService.deleteBloggerById(id);
    return result; // shouldn't return any data according SWAGGER
  }
}
