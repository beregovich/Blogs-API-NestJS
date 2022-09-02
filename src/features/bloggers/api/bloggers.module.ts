import { forwardRef, Module } from '@nestjs/common';
import { BloggersController } from './bloggers.controller';
import { BloggersService } from '../application/bloggers.service';
import { BloggersMongoRepository } from '../infrastructure/bloggers-mongo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersSchema } from '../../../infrastructure/database/db';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bloggers', schema: BloggersSchema }]),
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggersMongoRepository],
})
export class BloggersModule {}
