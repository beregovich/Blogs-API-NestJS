//FOR TESTS ONLY
import { InjectModel } from '@nestjs/mongoose';

export class RemoveAllRepository {
  constructor(
    @InjectModel('Bloggers') private bloggersModel,
    @InjectModel('Posts') private postsModel,
    @InjectModel('Users') private usersModel,
    @InjectModel('Comments') private commentsModel,
  ) {}
  async removeAll() {
    await this.bloggersModel.deleteMany({});
    await this.postsModel.deleteMany({});
    await this.usersModel.deleteMany({});
    await this.commentsModel.deleteMany({});
  }
}
