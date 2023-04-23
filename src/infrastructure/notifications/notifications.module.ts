import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { NotificationRepository } from './email/notification.repository';
import { NotificationsScheduler } from './email/email.scheduler';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [EmailService, NotificationRepository, NotificationsScheduler],
  exports: [EmailService],
})
export class NotificationsModule {}
