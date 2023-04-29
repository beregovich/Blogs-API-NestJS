import 'dotenv/config';
import mongoose from 'mongoose';
import {
  BlogType,
  CommentType,
  EmailConfirmationMessageType,
  EmailConfirmationType,
  UserAccountType,
  UserType,
} from '../../types/types';

//Schemas
export const BlogsSchema = new mongoose.Schema<BlogType>({
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
  blogId: String,
  blogName: String,
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
const userEmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
  isConfirmed: Boolean,
  confirmationCode: String,
  expirationDate: Date,
  //sentEmails: userSentConfirmationEmailSchema
  sentEmails: { type: [Date], required: false },
});
export const UsersSchema = new mongoose.Schema<UserType>({
  accountData: userAccountDataSchema,
  emailConfirmation: userEmailConfirmationSchema,
});

export const CommentsSchema = new mongoose.Schema<CommentType>({
  id: String,
  content: String,
  postId: String,
  userId: String,
  userLogin: String,
  addedAt: Date,
  likesInfo: [LikesSchema],
});

export const EmailsQueueSchema =
  new mongoose.Schema<EmailConfirmationMessageType>({
    email: String,
    message: String,
    subject: String,
    isSent: Boolean,
    createdAt: Date,
  });
