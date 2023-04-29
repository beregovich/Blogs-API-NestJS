// import { forwardRef, Module } from '@nestjs/common';
// import { PostsService } from './posts.service';
// import { PostsController } from './posts.controller';
// import { PostsRepository } from './posts.repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import { blogsSchema, PostsSchema } from '../database/db';
// import { BlogsModule } from '../blogs/blogs.module';
//
// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: 'Posts', schema: PostsSchema },
//       { name: 'blogs', schema: blogsSchema },
//     ]),
//     forwardRef(() => BlogsModule),
//   ],
//   controllers: [PostsController],
//   providers: [PostsService, PostsRepository],
// })
// export class PostsModule {}
