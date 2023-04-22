import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from '../application/blogs.service';
import { BlogsMongoRepository } from '../infrastructure/blogs-mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { blogsSchema } from '../../../infrastructure/database/db';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blogs', schema: blogsSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsMongoRepository],
})
export class BlogsModule {}
