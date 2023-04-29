import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './api/users.controller';
import { DatabaseModule } from '../../infrastructure/database/db.module';
import { UsersRepository } from './infrastructure/users.repository';
import { NotificationsModule } from '../../infrastructure/notifications/notifications.module';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Module({
  imports: [NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, CreateUserUseCase],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
