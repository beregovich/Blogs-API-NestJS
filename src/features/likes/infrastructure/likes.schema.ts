import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LikeAction } from '../../../types/types';

export type PostsLikesDocument = PostsLikes & Document;
export type CommentsLikesDocument = CommentsLikes & Document;

@Schema()
export class PostsLikes {
  @Prop()
  userId: string;

  @Prop()
  postId: number;

  @Prop()
  action: LikeAction;

  @Prop()
  lastActionAt: Date;
}

@Schema()
export class CommentsLikes {
  @Prop()
  userId: string;

  @Prop()
  commentId: number;

  @Prop()
  action: LikeAction;

  @Prop()
  lastActionAt: Date;
}

export const PostsLikesSchema = SchemaFactory.createForClass(PostsLikes);
export const CommentsLikesSchema = SchemaFactory.createForClass(CommentsLikes);
