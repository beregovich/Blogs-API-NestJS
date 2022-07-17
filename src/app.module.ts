import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { DatabaseModule } from './database/db.module';

@Module({
  imports: [PostsModule, BloggersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
