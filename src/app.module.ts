import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersController } from './bloggers/bloggers.controller';
import { PostsModule } from './posts/posts.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [AppController, BloggersController],
  providers: [AppService],
})
export class AppModule {}
