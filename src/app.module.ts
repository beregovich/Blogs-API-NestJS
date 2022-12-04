import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './features/users/users.controller';
import { PostsController } from './features/posts/posts.controller';
import { BloggersController } from './features/bloggers/api/bloggers.controller';
import { AuthController } from './features/auth/auth.controller';
import { CommentsController } from './features/comments/comments.controller';
import { BloggersService } from './features/bloggers/application/bloggers.service';
import { BloggersMongoRepository } from './features/bloggers/infrastructure/bloggers-mongo.repository';
import { CommentsService } from './features/comments/comments.service';
import { Scheduler } from './infrastructure/notification/email.scheduler';
import { EmailService } from './infrastructure/notification/email.service';
import { NotificationRepository } from './infrastructure/notification/notification.repository';
import { PostsService } from './features/posts/posts.service';
import { PostsMongoRepository } from './features/posts/infrastructure/posts.repository';
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
import { LikesService } from './features/likes/application/likes.service';
import { LikesRepository } from './features/likes/infrastructure/likes.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Blogger } from './features/bloggers/entities/blogger.entity';
import { BloggersSqlRepository } from './features/bloggers/infrastructure/bloggers-sql.repository';
import { typeOrmLocalPostgres } from './config';
import { PostsSqlRepository } from './features/posts/infrastructure/posts-sql.repository';
import { JwtPayloadExtractorStrategy } from './guards/common/jwt-payload-extractor.strategy';
import { JwtPayloadExtractorGuard } from './guards/common/jwt-payload-extractor.guard';
import { RemoveAllController } from './features/testing/testing.controller';
import { TestingMongoRepository } from './features/testing/testing-mongo.repository';
import { CheckPostExistingGuard } from './guards/auth/check-post-existing.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/postgres.configuration';
import { TestingSQLRepository } from "./features/testing/testing-sql.repository";
import { BloggersTypeOrmRepository } from "./features/bloggers/infrastructure/bloggers-typeOrm.repository";

interface IPostgresConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: boolean;
  synchronize: boolean;
  ssl: { rejectUnauthorized: boolean };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.enswitv',
      load: [configuration],
    }),
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        switch (process.env.USE_DATABASE){
          case 'RawSql':
            return configService.get<TypeOrmModuleOptions>('RawSqlHerokuConfig');
            break;
          case 'TypeOrm':
            return configService.get<TypeOrmModuleOptions>('TypeOrmHerokuConfig');
            break;
          default:
            return configService.get<TypeOrmModuleOptions>('TypeOrmHerokuConfig');
            break;
        }
      },
      inject: [ConfigService],
    }),
     TypeOrmModule.forFeature([Blogger]),

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
    RemoveAllController,
  ],
  providers: [
    //Testing
    {
      provide: 'TestingRepository',
      useClass:
        process.env.USE_DATABASE === 'RawSql'
          ? TestingSQLRepository
          : TestingMongoRepository,
    },
    TestingMongoRepository,
    //Bloggers
    BloggersService,
    {
      provide: 'BloggersRepository',
      useClass: (() => {
          switch (process.env.USE_REPO){
            case 'RawSql':
              return BloggersSqlRepository;
            case 'TypeOrm':
              return BloggersTypeOrmRepository;
            case 'Mongo':
              return BloggersMongoRepository;
            default:
              return BloggersTypeOrmRepository;
          }
      })(),
      // useFactory: (configService: ConfigService)=>{
      //   switch (process.env.USE_REPO){
      //     case 'RawSql':
      //       return BloggersSqlRepository;
      //     case 'TypeOrm':
      //       return BloggersTypeOrmRepository;
      //     case 'Mongo':
      //       return BloggersMongoRepository;
      //     default:
      //       return BloggersTypeOrmRepository;
      //   }
      // },
      // useClass:
      //   process.env.USE_DATABASE === 'RawSql'
      //     ? BloggersSqlRepository
      //     : BloggersMongoRepository,
    },
    //Comments
    CommentsService,
    CommentsRepository,
    //Posts
    PostsService,
    {
      provide: 'PostsRepository',
      useClass:
        process.env.USE_DATABASE === 'RawSql'
          ? PostsSqlRepository
          : PostsMongoRepository,
    },
    //Users
    UsersService,
    UsersRepository,
    AuthService,
    //Likes
    LikesService,
    LikesRepository,
    //Other
    Scheduler,
    EmailService,
    NotificationRepository,
    LocalStrategy,
    JwtStrategy,
    JwtPayloadExtractorStrategy,
    JwtPayloadExtractorGuard,
    CheckPostExistingGuard,
  ],
})
export class AppModule {}
