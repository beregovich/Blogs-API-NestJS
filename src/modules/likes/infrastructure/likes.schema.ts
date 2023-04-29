import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LikeAction } from '../../../types/types';

export type PostsLikesDocument = PostsLikes & Document;
export type CommentsLikesDocument = CommentsLikes & Document;

@Schema({ collection: 'PostsLikes' })
export class PostsLikes {
  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  postId: string;

  @Prop({ default: 'None' })
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

  @Prop({ default: 'None' })
  action: LikeAction;

  @Prop()
  lastActionAt: Date;
}

export const PostsLikesSchema = SchemaFactory.createForClass(PostsLikes);
export const CommentsLikesSchema = SchemaFactory.createForClass(CommentsLikes);
