import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsService.getCommentById(id);
  }

  @Put(':id')
  async updateComment(@Param('id') id: string, @Body() content: string) {
    return await this.commentsService.updateCommentById(id, content);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentsService.deleteComment(id);
  }
}
