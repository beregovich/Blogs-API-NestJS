import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtPayloadExtractorGuard } from '../../guards/common/jwt-payload-extractor.guard';
import { Pagination } from '../../infrastructure/common/pagination.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckCommentExistingGuard } from '../../guards/auth/check-comment-existing.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId || null;
    return await this.commentsService.getCommentById(id, userId);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateComment(@Param('id') id: string, @Body() content: string) {
    return await this.commentsService.updateCommentById(id, content);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentsService.deleteComment(id);
  }

  @UseGuards(JwtPayloadExtractorGuard)
  @Get('comments/:postId')
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
  @UseGuards(CheckCommentExistingGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  async updateLikeByCommentId(
    @Param('commentId') commentId: string,
    @Body('likeStatus') likeStatus: any,
    @Request() req,
  ) {
    const test = likeStatus;
    const result = await this.commentsService.updateLikeByCommentId(
      commentId,
      likeStatus,
      req.user.userId,
    );
    return result;
  }
}
