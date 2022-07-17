import { forwardRef, Module } from '@nestjs/common';
import { BloggersController } from './bloggers.controller';
import { BloggersService } from './bloggers.service';
import { BloggersRepository } from './bloggers.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersSchema } from '../database/db';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bloggers', schema: BloggersSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggersRepository],
})
export class BloggersModule {}
