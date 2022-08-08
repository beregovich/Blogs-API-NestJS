import 'dotenv/config';
import mongoose, { Schema } from 'mongoose';
import {
  BloggerType,
  CommentType,
  EmailConfirmationMessageType,
  EmailConfirmationType,
  LikeAction,
  LimitsControlType,
  PostType,
  SentConfirmationEmailType,
  UserAccountType,
  UserType,
} from '../../types/types';
import { Prop } from '@nestjs/mongoose';

const mongoUri = process.env.mongoURI || '';

//Schemas
export const BloggersSchema = new mongoose.Schema<BloggerType>({
  id: String,
  name: String,
  youtubeUrl: String,
});

const LikesSchema = new mongoose.Schema<any>({
  userId: String,
  login: String,
  action: String,
  addedAt: Date,
});

export const PostsSchema = new mongoose.Schema<any>({
  addedAt: Date,
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  bloggerId: String,
  bloggerName: String,
  extendedLikesInfo: [LikesSchema],
});

const userAccountDataSchema = new mongoose.Schema<UserAccountType>({
  id: String,
  email: String,
  login: String,
  passwordHash: String,
  createdAt: Date,
  revokedTokens: { type: [String], required: false },
});
const userSentConfirmationEmailSchema =
  new mongoose.Schema<SentConfirmationEmailType>({
    sentDate: Date,
  });
const userEmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
  isConfirmed: Boolean,
  confirmationCode: String,
  expirationDate: Date,
  //sentEmails: userSentConfirmationEmailSchema
  sentEmails: { type: [Date], required: false },
});
export const usersSchema = new mongoose.Schema<UserType>({
  accountData: userAccountDataSchema,
  emailConfirmation: userEmailConfirmationSchema,
});

export const commentsSchema = new mongoose.Schema<CommentType>({
  id: String,
  content: String,
  postId: String,
  userId: String,
  userLogin: String,
  addedAt: Date,
  likesInfo: [LikesSchema],
});

export const limitsSchema = new mongoose.Schema<LimitsControlType>({
  userIp: String,
  url: String,
  time: Date,
});
export const emailsQueueSchema =
  new mongoose.Schema<EmailConfirmationMessageType>({
    email: String,
    message: String,
    subject: String,
    isSent: Boolean,
    createdAt: Date,
  });

export async function runDb() {
  try {
    await mongoose.connect(mongoUri);
    const connectionId = mongoose.connection.id;
    console.log('Mongoose connection complete with id: ', connectionId);
  } catch (e) {
    console.log('No connection, error: ', e);
  }
}
