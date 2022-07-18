import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { DatabaseModule } from './database/db.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostsModule, BloggersModule, DatabaseModule, UsersModule, CommentsModule, AuthModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
