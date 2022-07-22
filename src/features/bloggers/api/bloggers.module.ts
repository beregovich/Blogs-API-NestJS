import { forwardRef, Module } from '@nestjs/common';
import { BloggersController } from './bloggers.controller';
import { BloggersService } from '../application/bloggers.service';
import { BloggersRepository } from '../infrastructure/bloggers.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersSchema } from '../../../infrastructure/database/db';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bloggers', schema: BloggersSchema }]),
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggersRepository],
})
export class BloggersModule {}
