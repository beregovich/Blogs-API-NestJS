import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersSchema, PostsSchema } from '../database/db';
import { BloggersModule } from '../bloggers/bloggers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Posts', schema: PostsSchema },
      { name: 'Bloggers', schema: BloggersSchema },
    ]),
    forwardRef(() => BloggersModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
