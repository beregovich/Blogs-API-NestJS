import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './features/users/users.controller';
import { PostsController } from './features/posts/posts.controller';
import { BloggersController } from './features/bloggers/api/bloggers.controller';
import { AuthController } from './features/auth/auth.controller';
import { CommentsController } from './features/comments/comments.controller';
import { BloggersService } from './features/bloggers/application/bloggers.service';
import { BloggersRepository } from './features/bloggers/infrastructure/bloggers.repository';
import { CommentsService } from './features/comments/comments.service';
import { Scheduler } from './infrastructure/notification/email.scheduler';
import { EmailService } from './infrastructure/notification/email.service';
import { NotificationRepository } from './infrastructure/notification/notification.repository';
import { PostsService } from './features/posts/posts.service';
import { PostsRepository } from './features/posts/posts.repository';
import { UsersService } from './features/users/users.service';
import { UsersRepository } from './features/users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggersSchema,
  commentsSchema,
  emailsQueueSchema,
  limitsSchema,
  PostsSchema,
  usersSchema,
} from './infrastructure/database/db';
import { AuthService } from './features/auth/auth.service';
import { DatabaseModule } from './infrastructure/database/db.module';
import { CommentsRepository } from './features/comments/comments.repository';
import {
  CommentsLikesSchema,
  PostsLikesSchema,
} from './features/likes/infrastructure/likes.schema';
import { LikesService } from './features/likes/entities/application/likes.service';
import { LikesRepository } from './features/likes/infrastructure/likes.repository';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Bloggers', schema: BloggersSchema },
      { name: 'Posts', schema: PostsSchema },
      { name: 'Users', schema: usersSchema },
      { name: 'Comments', schema: commentsSchema },
      { name: 'Limits', schema: limitsSchema },
      { name: 'EmailsQueue', schema: emailsQueueSchema },
      { name: 'PostsLikes', schema: PostsLikesSchema },
      { name: 'CommentsLikes', schema: CommentsLikesSchema },
    ]),
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    UsersController,
    PostsController,
    BloggersController,
    AuthController,
    CommentsController,
    PostsController,
    UsersController,
  ],
  providers: [
    BloggersService,
    BloggersRepository,
    CommentsService,
    CommentsRepository,
    Scheduler,
    EmailService,
    NotificationRepository,
    PostsService,
    PostsRepository,
    UsersService,
    UsersRepository,
    AuthService,
    LikesService,
    LikesRepository,
  ],
})
export class AppModule {}
