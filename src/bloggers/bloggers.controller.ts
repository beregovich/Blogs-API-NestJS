import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('bloggers')
export class BloggersController {
  @Get()
  getBloggers() {
    return null;
  }

  @Get('/:id')
  getBloggerById(@Param('id') id: string) {
    return null;
  }

  @Post()
  createBlogger(@Body() newBlogger) {
    return { name: newBlogger.name, youtubeUrl: newBlogger.youtubeUrl };
  }

  @Put('/:id')
  updateBlogger(@Param('id') id: string, @Body() bloggerUpdateData) {
    return {
      name: bloggerUpdateData.name,
      youtubeUrl: bloggerUpdateData.youtubeUrl,
    };
  }
  @Delete('/:id')
  deleteBloggerById(@Param('id') id: string) {
    return null;
  }
}
