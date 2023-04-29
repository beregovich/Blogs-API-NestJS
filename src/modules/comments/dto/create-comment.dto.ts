import { Length } from 'class-validator';

export class CreateCommentDto {
  @Length(20, 300)
  content: string;
}
