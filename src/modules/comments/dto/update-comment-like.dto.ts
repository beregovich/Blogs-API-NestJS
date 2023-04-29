import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { LikeAction, LikeActionType } from '../../../types/types';

export class UpdateCommentDto {
  likeStatus: LikeActionType;
}
