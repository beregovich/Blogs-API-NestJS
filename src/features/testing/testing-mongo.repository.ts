import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserType } from '../../types/types';
import { Injectable } from "@nestjs/common";

@Injectable()
export class TestingMongoRepository {
  constructor(
    @InjectModel('Comments') private commentsModel,
    @InjectModel('Posts') private postsModel,
    @InjectModel('Bloggers') private bloggersModel,
    @InjectModel('Users') private usersModel: mongoose.Model<UserType>,
    @InjectModel('EmailsQueue') private emailsQueueModel,
  ) {}
  async deleteAllData() {
    await this.commentsModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.bloggersModel.deleteMany({});
    await this.usersModel.deleteMany({});
    await this.emailsQueueModel.deleteMany({});
    return null;
  }
}
