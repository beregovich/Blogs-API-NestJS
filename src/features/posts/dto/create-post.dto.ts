import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @Length(0, 30)
  title: string;
  @Length(0, 100)
  shortDescription: string;
  @Length(0, 1000)
  content: string;
  @IsString()
  bloggerId: string;
}
