import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @Length(3, 30)
  title: string;
  @Length(3, 100)
  shortDescription: string;
  @Length(3, 1000)
  content: string;
  @IsString()
  bloggerId: string;
}
