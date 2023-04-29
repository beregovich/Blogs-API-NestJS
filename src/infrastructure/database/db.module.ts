import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogsSchema,
  CommentsSchema,
  EmailsQueueSchema,
  PostsSchema,
  UsersSchema,
} from './models';
import {
  CommentsLikesSchema,
  PostsLikesSchema,
} from '../../features/likes/infrastructure/likes.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../../features/blogs/entities/blog.entity';
import { AppSettings } from '../../settings/app-settings';
import { ConfigModule } from '../../settings/config.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (appSettings: AppSettings) => ({
        type: 'postgres' as const,
        host: appSettings.database.POSTGRES_HOST,
        port: appSettings.database.POSTGRES_PORT,
        username: appSettings.database.POSTGRES_USER,
        password: appSettings.database.POSTGRES_PASSWORD,
        database: appSettings.database.POSTGRES_DATABASE,
        autoLoadEntities: false,
        synchronize: true,
        ssl: { rejectUnauthorized: false },
      }),
      inject: [AppSettings.name],
    }),
    TypeOrmModule.forFeature([Blog]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (appSettings: AppSettings) => ({
        uri: appSettings.database.MONGO_URI,
      }),
      inject: [AppSettings.name],
    }),
    MongooseModule.forFeature([
      { name: 'Blogs', schema: BlogsSchema },
      { name: 'Posts', schema: PostsSchema },
      { name: 'Users', schema: UsersSchema },
      { name: 'Comments', schema: CommentsSchema },
      { name: 'EmailsQueue', schema: EmailsQueueSchema },
      { name: 'PostsLikes', schema: PostsLikesSchema },
      { name: 'CommentsLikes', schema: CommentsLikesSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule, TypeOrmModule],
})
export class DatabaseModule {}
