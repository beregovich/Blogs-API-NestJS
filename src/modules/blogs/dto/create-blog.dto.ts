import { IsString, Length, Matches } from 'class-validator';

export class CreateBlogDto {
  @Length(0, 15)
  name: string;
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/)
  @Length(0, 100)
  youtubeUrl: string;
}
