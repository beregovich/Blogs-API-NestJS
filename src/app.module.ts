import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './modules/users/api/users.controller';
import { PostsController } from './modules/posts/posts.controller';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { BlogsService } from './modules/blogs/application/blogs.service';
import { CommentsService } from './modules/comments/comments.service';
import { PostsService } from './modules/posts/posts.service';
import { DatabaseModule } from './infrastructure/database/db.module';
import { CommentsRepository } from './modules/comments/comments.repository';
import { LikesService } from './modules/likes/application/likes.service';
import { LikesRepository } from './modules/likes/infrastructure/likes.repository';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { JwtPayloadExtractorStrategy } from './guards/common/jwt-payload-extractor.strategy';
import { JwtPayloadExtractorGuard } from './guards/common/jwt-payload-extractor.guard';
import { RemoveAllController } from './modules/testing/testing.controller';
import { CheckPostExistingGuard } from './guards/auth/check-post-existing.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BlogsRepository } from './modules/blogs/infrastructure/blogs-typeOrm.repository';
import { PostsRepository } from './modules/posts/infrastructure/posts.repository';
import { NotificationsModule } from './infrastructure/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
  ],
  controllers: [
    AppController,
    PostsController,
    BlogsController,
    CommentsController,
    PostsController,
    RemoveAllController,
  ],
  providers: [
    //Blogs
    BlogsService,
    BlogsRepository,
    //Comments
    CommentsService,
    CommentsRepository,
    //Posts
    PostsService,
    PostsRepository,
    //Likes
    LikesService,
    LikesRepository,
    //Other
    JwtStrategy,
    JwtPayloadExtractorStrategy,
    JwtPayloadExtractorGuard,
    CheckPostExistingGuard,
  ],
  exports: [],
})
export class AppModule {}
