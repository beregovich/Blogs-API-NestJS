import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtPayloadExtractorGuard } from '../../guards/common/jwt-payload-extractor.guard';
import { Pagination } from '../../infrastructure/common/pagination.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckCommentExistingGuard } from '../../guards/auth/check-comment-existing.guard';
import { LikeAction } from '../../types/types';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtPayloadExtractorGuard)
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

  @UseGuards(JwtAuthGuard)
  @UseGuards(CheckCommentExistingGuard)
  @HttpCode(204)
  @Put(':commentId/like-status')
  async updateLikeByCommentId(
    @Param('commentId') commentId: string,
    @Body(
      'likeStatus',
      new ParseEnumPipe(LikeAction, {
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: (error) => {
          throw new BadRequestException({
            message: [
              {
                message: 'wrong value',
                field: 'likeStatus',
              },
            ],
          });
        },
      }),
    )
    likeStatus: LikeAction,
    @Request() req,
  ) {
    const result = await this.commentsService.updateLikeByCommentId(
      commentId,
      likeStatus,
      req.user?.userId || null,
    );
    return result;
  }
}
