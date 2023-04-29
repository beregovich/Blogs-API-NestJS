import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './features/users/users.controller';
import { PostsController } from './features/posts/posts.controller';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { AuthController } from './features/auth/auth.controller';
import { CommentsController } from './features/comments/comments.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { CommentsService } from './features/comments/comments.service';
import { PostsService } from './features/posts/posts.service';
import { DatabaseModule } from './infrastructure/database/db.module';
import { CommentsRepository } from './features/comments/comments.repository';
import { LikesService } from './features/likes/application/likes.service';
import { LikesRepository } from './features/likes/infrastructure/likes.repository';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import { JwtPayloadExtractorStrategy } from './guards/common/jwt-payload-extractor.strategy';
import { JwtPayloadExtractorGuard } from './guards/common/jwt-payload-extractor.guard';
import { RemoveAllController } from './features/testing/testing.controller';
import { CheckPostExistingGuard } from './guards/auth/check-post-existing.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { BlogsRepository } from './features/blogs/infrastructure/blogs-typeOrm.repository';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
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
    UsersController,
    PostsController,
    BlogsController,
    CommentsController,
    PostsController,
    UsersController,
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
