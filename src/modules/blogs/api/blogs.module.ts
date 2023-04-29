import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from '../application/blogs.service';
import { BlogsMongoRepository } from '../infrastructure/blogs-mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsSchema } from '../../../infrastructure/database/models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blogs', schema: BlogsSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsMongoRepository],
})
export class BlogsModule {}
