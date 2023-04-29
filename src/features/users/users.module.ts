import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../../infrastructure/database/db.module';
import { UsersRepository } from './users.repository';
import { NotificationsModule } from '../../infrastructure/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
