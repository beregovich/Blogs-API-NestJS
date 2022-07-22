import { IsString, Length, Matches } from 'class-validator';

export class CreateBloggerDto {
  @Length(0, 15)
  name: string;
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/)
  @Length(0, 3)
  youtubeUrl: string;
}
